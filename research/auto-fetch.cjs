// Automatically fetch missing artist, genre, BPM, Key, and bilingual lyrics (with zh-TW translation)
// for any song in SEED or research/songs-reviewed.json that has blank fields.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const here = __dirname;
const rootDir = path.join(here, '..');
const readJson = name => JSON.parse(fs.readFileSync(path.join(here, name), 'utf8'));
const writeJson = (name, data) => fs.writeFileSync(path.join(here, name), JSON.stringify(data, null, 2) + '\n');

function mapGenre(rawGenre, currentGenre) {
  if (currentGenre) return currentGenre;
  const g = String(rawGenre || '').toLowerCase();
  if (/rock|punk|metal|alternative|ロック|搖滾/.test(g)) return '搖滾';
  if (/folk|acoustic|singer|民謠/.test(g)) return '民謠';
  if (/r&b|soul/.test(g)) return 'R&B';
  if (/hip-hop|rap|說唱|饒舌/.test(g)) return '說唱';
  if (/anime|soundtrack|アニメ|動漫|原聲/.test(g)) return '動漫/影視';
  if (/ballad|抒情/.test(g)) return '抒情';
  return '流行';
}

function mostFrequent(arr) {
  if (!arr.length) return null;
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

async function fetchItunes(title, artist, lang) {
  const countries = lang === 'ja' ? ['JP', 'TW', 'US'] : lang === 'zh' ? ['TW', 'HK', 'US'] : ['US', 'TW', 'JP'];
  for (const country of countries) {
    try {
      const q = artist ? `${title} ${artist}` : title;
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&country=${country}&limit=8`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.results || !data.results.length) continue;
      const norm = s => String(s || '').normalize('NFKC').toLowerCase().trim();
      const targetTitle = norm(title);
      const exact = data.results.find(r => norm(r.trackName).includes(targetTitle) || targetTitle.includes(norm(r.trackName))) || data.results[0];
      return {
        artist: exact.artistName || artist || '',
        genre: mapGenre(exact.primaryGenreName, ''),
        trackName: exact.trackName || title
      };
    } catch (_) {}
  }
  return { artist: artist || '', genre: '流行', trackName: title };
}

async function fetchBpmAndKey(title, artist, genre) {
  const cleanTitle = String(title || '').replace(/\s*[-(-].*$/, '').trim() || title;
  const sources = [];
  let bpmCandidates = [];
  let keyCandidates = [];

  // 1. Yahoo Japan search for BPM & 原曲キー
  try {
    const q = `${cleanTitle} ${artist} BPM 原曲キー Key`;
    const yUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(q)}`;
    const yRes = await fetch(yUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (yRes.ok) {
      const html = await yRes.text();
      const textOnly = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ');

      const bpms = [...textOnly.matchAll(/(?:BPM|テンポ)\s*(?:は|：|:|=|＝|約)?\s*(\d{2,3})\b|\b(\d{2,3})\s*BPM\b/gi)]
        .map(m => +(m[1] || m[2]))
        .filter(n => n >= 40 && n <= 240);
      bpmCandidates.push(...bpms);

      const keyPatterns = [
        /(?:原曲キー|キー|Key|調性|原調)\s*(?:は|：|:|=|＝|in)?\s*([A-G](?:#|b|♯|♭)?(?:m|minor|major|マイナー|メジャー)?)(?![a-zA-Z])/g,
        /\b([A-G](?:#|b|♯|♭)?)\s*(?:メジャー|マイナー|大調|小調)/g,
        /\bin\s+([A-G](?:#|b|♯|♭)?)\s+(?:Major|Minor)\b/g
      ];
      for (const pat of keyPatterns) {
        for (const m of textOnly.matchAll(pat)) {
          let raw = m[0], k = m[1].replace('♯', '#').replace('♭', 'b');
          if (/minor|マイナー|小調|m$/.test(raw) && !k.endsWith('m')) k += 'm';
          k = k.replace(/(?:major|minor|メジャー|マイナー)$/i, '');
          if (/^[A-G](#|b)?m?$/.test(k)) keyCandidates.push(k);
        }
      }
      if (bpms.length || keyCandidates.length) sources.push(yUrl);
    }
  } catch (_) {}

  // 2. MusicBrainz + AcousticBrainz fallback
  if (!bpmCandidates.length || !keyCandidates.length) {
    try {
      const mbUrl = `https://musicbrainz.org/ws/2/recording/?query=recording:${encodeURIComponent(cleanTitle)}${artist ? '%20AND%20artist:' + encodeURIComponent(artist) : ''}&limit=5&fmt=json`;
      const mbRes = await fetch(mbUrl, {
        headers: { 'User-Agent': 'JenSongbook/1.0 (https://mickey0808449-cloud.github.io/songbook/)' }
      });
      if (mbRes.ok) {
        const mbData = await mbRes.json();
        for (const rec of (mbData.recordings || [])) {
          const abUrl = `https://acousticbrainz.org/api/v1/${rec.id}/low-level`;
          const abRes = await fetch(abUrl);
          if (abRes.ok) {
            const ab = await abRes.json();
            if (ab.rhythm?.bpm) bpmCandidates.push(Math.round(ab.rhythm.bpm));
            if (ab.tonal?.key_key) {
              const k = ab.tonal.key_key + (ab.tonal.key_scale === 'minor' ? 'm' : '');
              keyCandidates.push(k);
            }
            sources.push(`https://musicbrainz.org/recording/${rec.id}`);
            break;
          }
        }
      }
    } catch (_) {}
  }

  let rawBpm = mostFrequent(bpmCandidates);
  let outBpm = rawBpm;
  let refBpm = rawBpm ? String(rawBpm) : '待確認';
  if (rawBpm && rawBpm > 100 && (genre === '抒情' || genre === '民謠' || rawBpm >= 126) && genre !== '搖滾') {
    outBpm = Math.round(rawBpm / 2);
    refBpm = `${outBpm} / ${rawBpm}`;
  }
  const outKey = mostFrequent(keyCandidates) || '';
  return {
    bpm: outBpm || null,
    referenceBpm: refBpm,
    key: outKey,
    referenceKey: outKey || '待確認',
    sources: sources.length ? sources : [`https://www.google.com/search?q=${encodeURIComponent(title + ' ' + artist + ' BPM Key')}`]
  };
}

async function translateLinesToZhTW(lines, sourceLang) {
  if (!lines.length) return [];
  const sl = sourceLang === 'zh' ? 'zh-CN' : sourceLang === 'ja' ? 'ja' : sourceLang === 'en' ? 'en' : 'auto';
  const out = [];
  const chunkSize = 25;
  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize);
    const joined = chunk.join('\n');
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=zh-TW&dt=t&q=${encodeURIComponent(joined)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const translatedText = (data[0] || []).map(x => x[0]).join('');
        const splitLines = translatedText.split('\n').map(s => s.trim());
        for (let j = 0; j < chunk.length; j++) {
          out.push(splitLines[j] || '');
        }
        continue;
      }
    } catch (_) {}
    for (let j = 0; j < chunk.length; j++) out.push('');
  }
  return out;
}

async function fetchLyricsBilingual(title, artist, lang) {
  const cleanTitle = String(title || '').replace(/\s*[-(-].*$/, '').trim() || title;
  const queries = [
    `https://lrclib.net/api/search?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(artist || '')}`,
    `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTitle + ' ' + (artist || ''))}`,
    `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTitle)}`
  ];
  let plain = '';
  for (const url of queries) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const list = await res.json();
      if (!Array.isArray(list) || !list.length) continue;
      const match = list.find(item => item.plainLyrics && item.plainLyrics.trim().length > 40) ||
                    list.find(item => item.syncedLyrics && item.syncedLyrics.trim().length > 40);
      if (match) {
        plain = match.plainLyrics || match.syncedLyrics.replace(/\[[\d:.]+\]\s*/g, '');
        break;
      }
    } catch (_) {}
  }
  if (!plain) return '';

  // Parse into paragraphs and lines
  const rawLines = plain.replace(/\r/g, '').trim().split('\n');
  const nonEmptyLines = [];
  const structure = []; // { type: 'line', idx } or { type: 'sec' }
  let blankCount = 0;
  for (const raw of rawLines) {
    const t = raw.trim();
    if (!t) {
      blankCount++;
      continue;
    }
    if (blankCount > 0 && nonEmptyLines.length > 0) {
      structure.push({ type: 'sec' });
    }
    blankCount = 0;
    structure.push({ type: 'line', idx: nonEmptyLines.length, text: t });
    nonEmptyLines.push(t);
  }

  if (lang === 'zh') {
    const tradLines = await translateLinesToZhTW(nonEmptyLines, 'zh');
    const blocks = [];
    let pendingSec = false;
    for (const item of structure) {
      if (item.type === 'sec') { pendingSec = true; continue; }
      const lineText = tradLines[item.idx] || item.text;
      blocks.push((pendingSec ? '\n' : '') + lineText);
      pendingSec = false;
    }
    return blocks.join('\n\n').trim();
  } else {
    const zhLines = await translateLinesToZhTW(nonEmptyLines, lang);
    const blocks = [];
    let pendingSec = false;
    for (const item of structure) {
      if (item.type === 'sec') { pendingSec = true; continue; }
      const zh = zhLines[item.idx];
      const block = zh && zh !== item.text ? `${item.text}\n${zh}` : item.text;
      blocks.push((pendingSec ? '\n' : '') + block);
      pendingSec = false;
    }
    return blocks.join('\n\n').trim();
  }
}

async function main() {
  const htmlPath = path.join(rootDir, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const seedMatch = html.match(/const SEED = \[([\s\S]*?)\];/);
  const seedRows = seedMatch
    ? seedMatch[1].split('\n').map(l => l.trim().replace(/,$/, '')).filter(l => l.startsWith('[')).map(l => JSON.parse(l))
    : [];

  const audit = readJson('bpm-key-audit.json');
  const songs = readJson('songs-reviewed.json');
  const lyricsMap = readJson('lyrics.json');

  const norm = s => String(s || '').normalize('NFKC').trim().toLowerCase();
  // Ensure any new song in SEED is also in songs-reviewed.json & audit
  for (const r of seedRows) {
    const [title, artist = '', lang = 'ja', genre = '', bpm = null, status = 'todo', note = ''] = r;
    const exists = songs.find(s => norm(s.title) === norm(title) && (!artist || !s.artist || norm(s.artist) === norm(artist)));
    if (!exists) {
      songs.push({
        id: 'seed-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title,
        artist: artist || '',
        lang: lang || 'ja',
        genre: genre || '',
        bpm: bpm || null,
        key: '',
        status: status || 'todo',
        lyrics: '',
        translation: '',
        note: note || '',
        created: songs.length
      });
      audit.push({
        title,
        artist: artist || '',
        original_bpm: bpm || null,
        output_bpm: bpm || null,
        reference_bpm: bpm ? String(bpm) : '待確認',
        reference_key: '',
        output_key: '',
        assessment: '自動排程補齊。',
        sources: []
      });
    }
  }

  let updatedCount = 0;
  for (let i = 0; i < songs.length; i++) {
    const s = songs[i];
    let a = audit[i];
    if (!a) {
      a = {
        title: s.title,
        artist: s.artist || '',
        original_bpm: s.bpm || null,
        output_bpm: s.bpm || null,
        reference_bpm: s.bpm ? String(s.bpm) : '待確認',
        reference_key: s.key || '',
        output_key: s.key || '',
        assessment: '自動排程補齊。',
        sources: []
      };
      audit[i] = a;
    }

    const existingLyrics = s.lyrics || lyricsMap[String(i)] || '';
    const needsArtist = !s.artist;
    const needsGenre = !s.genre;
    const needsBpm = !s.bpm && !a.output_bpm;
    const needsKey = !s.key && !a.output_key;
    const needsLyrics = !existingLyrics.trim();

    if (!needsArtist && !needsGenre && !needsBpm && !needsKey && !needsLyrics) continue;

    console.log(`Auto-fetching missing data for [${i}] ${s.title} (${s.artist || 'unknown artist'})...`);
    let changed = false;

    if (needsArtist || needsGenre) {
      const it = await fetchItunes(s.title, s.artist, s.lang || 'ja');
      if (needsArtist && it.artist) { s.artist = it.artist; a.artist = it.artist; changed = true; }
      if (needsGenre && it.genre) { s.genre = it.genre; a.output_genre = it.genre; changed = true; }
    }

    if (needsBpm || needsKey) {
      const bk = await fetchBpmAndKey(s.title, s.artist, s.genre);
      if (needsBpm && bk.bpm) {
        s.bpm = bk.bpm;
        a.output_bpm = bk.bpm;
        a.reference_bpm = bk.referenceBpm;
        changed = true;
      }
      if (needsKey && bk.key) {
        s.key = bk.key;
        a.output_key = bk.key;
        a.reference_key = bk.referenceKey;
        changed = true;
      }
      if (bk.sources?.length) {
        a.sources = [...new Set([...(a.sources || []), ...bk.sources])];
      }
      if (!a.assessment) a.assessment = '自動排程查核補齊。';
    }

    if (needsLyrics) {
      const lyr = await fetchLyricsBilingual(s.title, s.artist, s.lang || 'ja');
      if (lyr) {
        s.lyrics = lyr;
        lyricsMap[String(i)] = lyr;
        changed = true;
      }
    }

    if (changed) updatedCount++;
  }

  if (updatedCount > 0 || songs.length !== Object.keys(lyricsMap).length) {
    writeJson('bpm-key-audit.json', audit);
    writeJson('songs-reviewed.json', songs);
    writeJson('lyrics.json', lyricsMap);
    execFileSync(process.execPath, [path.join(here, 'update-metadata.cjs')], { stdio: 'inherit' });
  }
  console.log(JSON.stringify({ totalSongs: songs.length, updatedCount }));
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { fetchItunes, fetchBpmAndKey, fetchLyricsBilingual };
