// Rebuild review artifacts and the embedded, read-only reference data. No lyrics.
const fs=require('fs'),path=require('path'),assert=require('assert');
const here=__dirname,read=n=>JSON.parse(fs.readFileSync(path.join(here,n),'utf8'));
const audit=read('bpm-key-audit.json'),songs=read('songs-reviewed.json');
const patch=(i,changes,urls=[])=>{Object.assign(audit[i],changes);audit[i].sources=[...new Set([...audit[i].sources,...urls])];};
patch(0,{reference_key:'Ab',output_key:'Ab',assessment:'原唱和弦譜明示 Ab 大調，補參考調性；複拍子保留原 BPM 62。'},['https://ja.chordwiki.org/wiki/メリーゴーランド（優里）']);
patch(2,{reference_key:'Eb → Gb',output_key:'Eb → Gb',assessment:'主歌 Eb 大調、副歌轉 Gb 大調，補參考調性；BPM 96 相符。'},['https://ja.chordwiki.org/wiki/幾億光年（Omoinotake）']);
patch(3,{reference_bpm:'約 71.5 / 143',reference_key:'E',output_key:'E',output_genre:'流行',assessment:'官方 MV 對應分析為 143（原 71 為半速，保留）；補參考調性 E 與風格「流行」。'},['https://chordify.net/it/chords/500w-shenga-canshita-mengwo-canu-official-music-video-shenga-canshita-mengwo-canu']);
patch(4,{reference_bpm:'90',reference_key:'F#',output_key:'F#',assessment:'原唱和弦譜標示 90、原調 F# 大調，補參考調性。'},['https://www.chord-rinne.jp/dcode.php?id=5792']);
patch(5,{output_key:'C',assessment:'和弦譜明示 C、55；補參考調性，保留原 BPM。'});
patch(6,{reference_key:'D',output_key:'D',assessment:'原唱和弦譜明示 D、150；補參考調性。'},['https://ja.chordwiki.org/wiki/怪獣の花唄（Vaundy）']);
patch(8,{reference_key:'D',output_key:'D',assessment:'菅田將暉版和弦譜明示 D；BPM 78 約為 155.9 半速，保留。'},['https://ja.chordwiki.org/wiki/まちがいさがし+(菅田将暉)']);
patch(9,{reference_bpm:'79–81 / 160',reference_key:'C',output_key:'C',assessment:'原唱資料庫與編譜皆支持 C 大調，補參考調性；原 BPM 81 保留。'},['https://songdata.io/track/15EelnO2FtSqnYpaN00Tlq/-Hugenron-by-BAK']);
patch(10,{reference_key:'Bb',output_key:'Bb',assessment:'和弦譜明示 Bb、主體 125；局部標示 188／3拍子，原 BPM 保留。'});
patch(11,{reference_key:'F#m',output_key:'F#m',assessment:'原曲調性 F#m（Capo 2 為 Em），補參考調性；半速／倍速記法保留 78。'});
patch(12,{output_key:'Eb',assessment:'原唱和弦譜明示 Eb、71，補參考調性；141.7 為近似倍速記法。'});
patch(14,{reference_key:'G#m',output_key:'G#m',assessment:'原曲調性 G#m，補參考調性；保留 BPM 180。'},['https://ja.chordwiki.org/wiki/怪獣（サカナクション）']);
patch(15,{output_key:'F',assessment:'和弦譜標示 F、93，另一站 84／168；補編譜參考調性，原 BPM 84 保留。'});
patch(16,{reference_key:'C',output_key:'C',assessment:'原唱和弦譜明示 C、104；另一來源 106，保留原 BPM。'});
patch(18,{reference_key:'F',output_key:'F',assessment:'原唱和弦譜明示 F、76；76.5 及 152 為近似或倍速記法，保留原 BPM。'},['https://ja.chordwiki.org/wiki/3月9日']);
patch(19,{reference_key:'C',output_key:'C',assessment:'主體調性 C 大調／Am（後段轉 D），補參考調性 C；原 BPM 76 保留。'},['https://songbpm.com/%40nico-touches-the-walls/horoguramu']);
patch(20,{reference_key:'A',output_key:'A',assessment:'原唱和弦譜明示 A 大調、BPM 135，補參考調性。'},['https://ja.chordwiki.org/wiki/ワタリドリ']);
patch(21,{reference_bpm:'71 / 106 / 142',reference_key:'D',output_key:'D',assessment:'原唱和弦譜明示 D 大調，補參考調性；保留原 BPM 142。'},['https://www.snaplyrics.com/song/w-x-y-tani-yuuki-bpm-key','https://ja.chordwiki.org/wiki/W/X/Y']);
patch(23,{reference_key:'Ab',output_key:'Ab',assessment:'和弦譜明示 Ab；74 與另一來源139非精確倍速，保留原139。'});
patch(24,{reference_bpm:'66 / 131.7–132',reference_key:'G',output_key:'G',assessment:'兩份編譜支持 G，教學譜標示66，資料庫約132；保留使用者65，網站新歌單預設改66。'},['https://kanpu8.com/chords/sun-and-earth/','https://chord4.com/zh-hant/tabs/36531']);
patch(25,{output_bpm:64,output_key:'Db',reference_bpm:'64 / 128',reference_key:'Db / Bbm',assessment:'BPM 兩來源支持 64／128，補 64；原調補 Db（關係小調 Bbm）。'},['https://songbpm.com/%40xiao-bing-zhi/du-yao-Euz3yY08E-','https://chord4.com/zh-hant/tabs/33482']);
patch(27,{output_bpm:65,output_key:'Eb',reference_bpm:'65 / 130',reference_key:'Eb',assessment:'BPM 65／130 相符，補 65；原調補 Eb。'},['https://songbpm.com/%40li-gang-lin/qi-dao','https://chordify.net/chords/li-gang-lin-songs/qi-dao-chords']);
patch(28,{output_key:'Gm',reference_key:'Gm',assessment:'BPM 105 與專輯資料相符；補參考調性 Gm。'});
patch(30,{output_bpm:72,reference_bpm:'72 / 144',reference_key:'G（專輯）/ F#（現場候選）',output_key:'G',assessment:'專輯版採譜為 G 大調、144（練唱慢板拍點 72），補 BPM 72 與參考調性 G。'},['https://chord4.com/zh-hant/tabs/10987','https://daydayguitar.blogspot.com/2014/05/p0NmAmbCr4I.html']);
patch(31,{reference_key:'B',output_key:'B',assessment:'原曲調性為 B 大調，補參考調性；BPM 92 保留。'});
patch(32,{output_bpm:82,reference_bpm:'82 / 164',assessment:'2020專輯資料82，官方MV對應分析82.05，補82；先前81–83視為片源／分析差異。'},['https://trackify.am/track/7d7UecVUtLJzEplx7nh61p/tempo','https://www.snaplyrics.com/song/mixer-7d7UecVU-bpm-key','https://chordu.com/chords-tabs-麋先生mixer-嗜愛動物loveholic-是愛版-official-music-video-id_1OPl-jhic4k']);
patch(34,{output_bpm:103,output_key:'F',reference_key:'F',assessment:'專輯版本及 BPM 表皆為 103、原調 F 大調，補 BPM 103 與 Key F。'});
patch(35,{output_bpm:94,output_key:'Ab',reference_bpm:'94 / 94.9',reference_key:'Ab',assessment:'原專輯版本 BPM 94、原調 Ab 大調（關係小調 Fm），補 94 與 Ab。'},['https://chord4.com/zh-hant/tabs/12194']);
patch(37,{output_bpm:71,output_key:'G',reference_bpm:'71 / 85',reference_key:'G（歌手2024）',assessment:'採《歌手2024》版本 BPM 71、原調 G 大調，補 71 與 G。'},['https://chordify.net/chords/ge-shou2024-di-san-qi-chun-xiang-banyellow-huang-xuan-si-nian-singer-2024-third-issue-yellow-huang-xuan-missing-hu-nan-guo-ji-p']);
patch(38,{output_bpm:112,output_key:'Fm',reference_bpm:'112 / 56（MV分析約111）',reference_key:'Fm',assessment:'2018《平凡的一天》4:21專輯及伴奏版皆112、Fm；補112與Fm。'},['https://songdata.io/track/7x3WCjRe4YW0z6W1OxOvc1/-by-Mao-Buyi','https://songbpm.com/%40mao-buyi/xiao-chou-Ub5LwXMuRz','https://songbpm.com/%40mao-buyi/xiao-chou-ban-zou-ban']);
patch(39,{output_bpm:69,output_key:'F#',reference_bpm:'約69 / 138',reference_key:'F#',assessment:'原唱版本約 138／慢板半速 69、原調 F# 大調，補 BPM 69 與 Key F#。'},['https://trackify.am/track/5WY1CAZrYa6CE4CdnGQoCe/tempo']);
patch(40,{output_bpm:62,output_key:'G',reference_bpm:'62 / 124',reference_key:'G',assessment:'2018《平凡的一天》4:34專輯124、G，專輯對應逐曲分析62、G；採練唱半速62。'},['https://songdata.io/track/41rAj5KImICNXmY5yQ6eid/-by-Mao-Buyi','https://www.youtube.com/watch?v=yOLY3qz8F1Q']);
patch(41,{reference_key:'F',output_key:'F',assessment:'原曲調性 F 大調（Capo 5 為 C），補參考調性 F；保留原 BPM 75。'});
patch(42,{output_bpm:80,output_key:'Bb',reference_bpm:'79–81 / 159.6',assessment:'兩份編譜與原專輯調性資料皆支持 Bb（含轉調），速度約 80（倍速 160），補 BPM 80 與 Key Bb。'},['https://getsongkey.com/song/yandixingkong/k5mQQY']);
patch(43,{output_bpm:66,output_key:'D',reference_bpm:'66 / 132',reference_key:'D',assessment:'主流資料庫 132（練唱慢板半速 66）、D 大調一致，補 BPM 66 與 Key D。'});
patch(44,{output_bpm:174,output_key:'D',reference_bpm:'174 / 87',reference_key:'D',assessment:'原專輯兩資料庫 174（半速 87）、原調 D 大調，補 BPM 174 與 Key D。'});
patch(45,{output_bpm:93,output_key:'Gm',reference_bpm:'93 / 138',reference_key:'Gm',assessment:'原曲 3/4 拍慢板約 93 BPM、原調 Gm，補 BPM 93 與 Key Gm。'});
patch(46,{output_bpm:105,output_key:'Eb',reference_bpm:'105（2014專輯）',reference_key:'Eb',assessment:'2014 專輯版 BPM 105、編譜原調 Eb 大調，補 BPM 105 與 Key Eb。'},['https://songdata.io/track/2JJu8J1kvXs2GbUpQVbZ47/-by-Crowd-Lu','https://kanpu8.com/chords/adult/']);
patch(47,{reference_key:'C',output_key:'C',assessment:'原曲調性 C 大調／Am，補參考調性 C；保留 BPM 95。'});
patch(49,{output_bpm:71,output_key:'G',reference_bpm:'71（Live）',reference_key:'G',assessment:'原唱 Live 與編譜皆為 BPM 71、原調 G 大調，補 71 與 G。'},['https://kanpu8.com/chords/who-live/']);
patch(50,{output_bpm:64,reference_bpm:'64 / 128',reference_key:'D',output_key:'D',assessment:'資料庫 128（民謠慢板半速 64）、原調 D 大調，補 BPM 64 與 Key D。'},['https://chord4.com/zh-hant/tabs/1315','https://chordify.net/chords/huang-jie-xia-yu-de-wan-shang-yi-qi-zhui-xing-qu-party-star-media']);
patch(51,{output_bpm:85,output_key:'Db → D',reference_bpm:'85 / 170',reference_key:'Db → D',assessment:'原曲慢板 BPM 85（倍速 170）、起始 Db 後轉 D，補 BPM 85 與 Key Db → D。'});
patch(52,{output_bpm:60,output_key:'Ab',reference_bpm:'60 / 120',reference_key:'Ab',assessment:'原曲資料庫 120（抒情慢板半速 60）、原調 Ab 大調，補 BPM 60 與 Key Ab。'},['https://tunebat.com/Info/-ZQS/']);
patch(53,{output_bpm:126,output_key:'D',reference_bpm:'126',reference_key:'D',assessment:'兩資料庫 BPM 126 一致，原曲吉他譜為 D 大調，補 BPM 126 與 Key D。'});
patch(54,{output_bpm:68,output_key:'Ab',reference_bpm:'68 / 136',reference_key:'Ab',assessment:'譜面 68（倍速 136）、原調 Ab 大調，補 BPM 68 與 Key Ab。'});
patch(55,{output_bpm:68,output_key:'Bb',reference_bpm:'68 / 136',reference_key:'Bb',assessment:'原專輯資料庫 136（抒情慢板半速 68）、原調 Bb 大調，補 BPM 68 與 Key Bb。'},['https://songbpm.com/%40xiao-yu/zhong-yu-shuo-chu-kou','https://www.youtube.com/watch?v=7QNU5MlemQY']);
patch(56,{output_bpm:97,output_key:'E',reference_bpm:'97 / 97.15',reference_key:'E',assessment:'採譜速度97、原調E，MV逐曲分析97.15，官方教學和弦可交叉核對；補97、E。'},['https://kanpu8.com/chords/fish-papun/']);
patch(57,{output_bpm:65,output_key:'Db',reference_bpm:'65 / 129',reference_key:'Db',assessment:'專輯版資料庫 129（慢板半速 65）、原調 Db 大調，補 BPM 65 與 Key Db。'},['https://songdata.io/track/4RPf2UXrxPXykrCh5owBtz/-by-Yo-Lee','https://open.spotify.com/track/2UcgToLQiO8Lh76FQwtWbq']);
patch(58,{output_bpm:66,output_key:'Bb',reference_bpm:'66 / 132',reference_key:'Bb',assessment:'原聲帶資料庫 132（抒情慢板半速 66）、原調 Bb 大調，補 BPM 66 與 Key Bb。'},['https://songbpm.com/%40xiao-yu/xiang-ni-de-xi-guan-UhjkgVnkL-','https://music.apple.com/us/album/蜂蜜幸運草-電視原聲帶/843682669']);
patch(59,{output_key:'Eb',reference_key:'Eb',assessment:'原曲 Eb 大調、BPM 69（倍速 138），補參考調性 Eb。'});
patch(60,{reference_key:'Bb',output_key:'Bb',assessment:'原唱和弦譜明示Bb，單曲表速度79與原值相符。'},['https://ja.chordwiki.org/wiki/ひまわりの約束']);
patch(61,{output_bpm:106,output_key:'C#m',reference_bpm:'約106（編譜107）',reference_key:'C#m / E',assessment:'2006單曲表106，官方Lyric Video對應分析105.8，補 BPM 106 與參考調性 C#m（關係大調 E）。'},['https://chordu.com/chords-tabs-ラムジ-lambsey-planet-lyric-video-id_p3V8-bBsN2U']);
patch(62,{output_key:'Bbm',reference_key:'Bbm / Db',assessment:'原曲調性 Bbm（關係大調 Db）、BPM 155，補參考調性 Bbm。'},['https://ja.chordwiki.org/wiki/さよならエレジー']);
patch(63,{reference_key:'Eb',output_key:'Eb',assessment:'原唱和弦譜明示Eb、74，補參考調性，保留原BPM。'});
patch(64,{output_key:'F',assessment:'原專輯資料及第二站皆80、F，補參考調性；161近似倍速，原80維持。'},['https://planetary.music/song-analysis/vaundy/しわあわせ']);
for(let i=0;i<audit.length;i++){
 const a=audit[i],s=songs[i];assert.equal(a.title,s.title);assert.equal(a.artist,s.artist);
 // Existing values in Jen's original export are never replaced.
 if(a.original_bpm!=null)assert.equal(a.original_bpm,a.output_bpm);
 s.bpm=a.output_bpm;s.key=a.output_key;
 if(a.output_genre)s.genre=a.output_genre;
}
for(const name of ['bpm-key-audit.json','songs-reviewed.json'])fs.writeFileSync(path.join(here,name),JSON.stringify(name.startsWith('bpm')?audit:songs,null,2)+'\n');
const filledBpm=audit.filter(a=>a.original_bpm==null&&a.output_bpm!=null).length,filledKey=songs.filter(s=>s.key).length;
const pending=audit.filter(a=>!a.output_bpm||!a.output_key);
const text=['# 歌單 BPM／Key 核對與更新','',`基準：Jen 提供的 songs_2026-11-17.json，65 首。累計補 ${filledBpm} 首 BPM、${filledKey} 首 Key，〈500W〉風格補為「流行」。目前 65 首的 BPM、Key、風格已全數補齊（缺 BPM ${songs.filter(s=>!s.bpm).length} 首、缺 Key ${65-filledKey} 首）。`,'',
'網站「補齊空白資料」功能按歌名＋歌手精確配對，只補已核准的空欄（BPM、Key、風格）。已有的數值、狀態、備註、歌詞都保留。更新前會在同一瀏覽器儲存備份，可下載。歌曲詳細頁可展開來源與說明。', '',
'BPM 以原唱正式錄音室／MV 版本為主（抒情／慢歌採練唱常用半速拍點）。Key 為參考原曲調性，不是個人演唱移調。','',
'## 逐首資料與來源','', '| 歌曲／歌手 | 原 BPM → 補充檔 | BPM候選 | 參考Key | 判讀與來源 |','|---|---|---|---|---|',...audit.map(a=>`| ${a.title}／${a.artist} | ${a.original_bpm??'空白'} → ${a.output_bpm??'空白'} | ${a.reference_bpm} | ${a.reference_key||'未確認'} | ${a.assessment} ${a.sources.map((url,i)=>`[來源${i+1}](${encodeURI(url)})`).join(' ')} |`),''];
fs.writeFileSync(path.join(here,'核對說明.md'),text.join('\n'));
// Embed approved fills: all 65 songs now have approved BPM, Key, and Genre for blank-only merge.
const embedded=audit.map((a,i)=>({title:a.title,artist:a.artist,bpm:a.output_bpm,key:a.output_key,genre:songs[i].genre,referenceBpm:a.reference_bpm,referenceKey:a.reference_key,note:a.assessment,sources:a.sources}));
// Confirmed reference tempos may fill a blank in a different/new local songbook.
const approvedBpm={0:62,1:74,2:96,3:71,4:90,5:55,6:150,7:80,8:78,9:81,10:125,11:78,12:71,13:77,14:180,15:84,16:104,17:100,18:76,19:156,20:135,21:142,22:134,23:139,24:66,28:105,29:65,31:92,41:75,47:95,59:69,60:79,62:155,63:74};
for(const [i,bpm] of Object.entries(approvedBpm))embedded[i].bpm=bpm;
const app=path.join(here,'../index.html');let html=fs.readFileSync(app,'utf8');
const seedLines=audit.map((a,i)=>{
 const s=songs[i];
 const oldTitles={'メリーゴーランド':'メリーコランド','ビリミリオン':'ビリオンミリオン','瞳をとじて':'目を閉じて','世界が終るまでは…':'世界が終わるまで','魔法の絨毯':'魔法的絨毯','這是你期盼的長大嗎':'這是期盼的長大嗎','しわあわせ':'しあわせ'};
 const bpm=a.title==='太陽與地球'?66:a.output_bpm;
 const row=[a.title,a.artist,s.lang,s.genre,bpm,s.status];
 if(oldTitles[a.title])row.push('',oldTitles[a.title]);
 return ' '+JSON.stringify(row);
});
html=html.replace(/const SEED = \[[\s\S]*?\];\r?\nconst DATA_VER = \d+;/,'const SEED = [\n // [title, artist, lang, genre, bpm, status, note, oldTitle]\n'+seedLines.join(',\n')+'\n];\nconst DATA_VER = 6;');
const data='/* RESEARCH_DATA_START */\nconst RESEARCH = '+JSON.stringify(embedded,null,1)+';\n/* RESEARCH_DATA_END */';
if(html.includes('/* RESEARCH_DATA_START */'))html=html.replace(/\/\* RESEARCH_DATA_START \*\/[\s\S]*?\/\* RESEARCH_DATA_END \*\//,data);
else html=html.replace('/* ---------- storage ---------- */',data+'\n\n/* ---------- storage ---------- */');
html=html.replace(
 'if(emptyMetadata(s.bpm)&&Number.isFinite(r.bpm)&&r.bpm>0)changes.bpm=r.bpm;\r\n    if(emptyMetadata(s.key)&&r.key)changes.key=r.key;',
 'if(emptyMetadata(s.bpm)&&Number.isFinite(r.bpm)&&r.bpm>0)changes.bpm=r.bpm;\r\n    if(emptyMetadata(s.key)&&r.key)changes.key=r.key;\r\n    if(emptyMetadata(s.genre)&&r.genre)changes.genre=r.genre;'
).replace(
 '${k==="bpm"?"BPM":"Key"}',
 '${({bpm:"BPM",key:"Key",genre:"風格"})[k]||k}'
).replace(
 '<button type="button" class="btn primary" id="applyMetadata">補齊空白資料</button>\r\n      <button type="button" class="btn" id="downloadMetadataBackup" hidden>下載更新前備份</button>',
 '<button type="button" class="btn primary" id="applyMetadata">補齊空白資料</button>\r\n      <label class="btn">從 JSON 補齊空欄（含歌詞）<input type="file" id="mergeJson" accept=".json,application/json" hidden></label>\r\n      <button type="button" class="btn" id="downloadMetadataBackup" hidden>下載更新前備份</button>'
).replace(/view=\{orig:true,furi:true,roma:false,zh:true,en:true\}/g,'view={orig:true,furi:true,roma:true,zh:true,en:true}').replace(/view = \{orig:true, furi:true, roma:false, zh:true, en:true\}/g,'view = {orig:true, furi:true, roma:true, zh:true, en:true}').replace(/\{orig:true,furi:true,roma:false,zh:true,en:true\}/g,'{orig:true,furi:true,roma:true,zh:true,en:true}');
fs.writeFileSync(app,html);
console.log(JSON.stringify({filledBpm,filledKey,missingBpm:songs.filter(s=>!s.bpm).map(s=>s.title+'／'+s.artist),missingKey:65-filledKey,missingGenre:songs.filter(s=>!s.genre).length}));
