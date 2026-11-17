// Rebuild review artifacts and the embedded, read-only reference data. No lyrics.
const fs=require('fs'),path=require('path'),assert=require('assert');
const here=__dirname,read=n=>JSON.parse(fs.readFileSync(path.join(here,n),'utf8'));
const audit=read('bpm-key-audit.json'),songs=read('songs-reviewed.json');
const patch=(i,changes,urls=[])=>{Object.assign(audit[i],changes);audit[i].sources=[...new Set([...audit[i].sources,...urls])];};
patch(3,{reference_bpm:'約 71.5 / 143',reference_key:'E',assessment:'官方 MV 對應分析為 143；原 71 約為半速，保留。Key 目前單一分析，留空。'},['https://chordify.net/it/chords/500w-shenga-canshita-mengwo-canu-official-music-video-shenga-canshita-mengwo-canu']);
patch(4,{reference_bpm:'90',assessment:'原唱和弦譜標示 90，與原值相符。'},['https://www.chord-rinne.jp/dcode.php?id=5792']);
patch(5,{output_key:'C',assessment:'和弦譜明示 C、55；補參考調性，保留原 BPM。'});
patch(6,{reference_key:'D',output_key:'D',assessment:'原唱和弦譜明示 D、150；補參考調性。'},['https://ja.chordwiki.org/wiki/怪獣の花唄（Vaundy）']);
patch(8,{reference_key:'D',output_key:'D',assessment:'菅田將暉版和弦譜明示 D；BPM 78 約為 155.9 半速，保留。'},['https://ja.chordwiki.org/wiki/まちがいさがし+(菅田将暉)']);
patch(9,{reference_bpm:'79–81 / 160',reference_key:'C',assessment:'原唱資料庫 79、編譜約 80；原 81 先保留，Key 尚待第二來源核對。'},['https://songdata.io/track/15EelnO2FtSqnYpaN00Tlq/-Hugenron-by-BAK']);
patch(10,{reference_key:'Bb',output_key:'Bb',assessment:'和弦譜明示 Bb、主體 125；局部標示 188／3拍子，原 BPM 保留。'});
patch(12,{output_key:'Eb',assessment:'原唱和弦譜明示 Eb、71，補參考調性；141.7 為近似倍速記法。'});
patch(15,{output_key:'F',assessment:'和弦譜標示 F、93，另一站 84／168；補編譜參考調性，原 BPM 84 保留並列待確認。'});
patch(16,{reference_key:'C',output_key:'C',assessment:'原唱和弦譜明示 C、104；另一來源 106，保留原 BPM。'});
patch(18,{reference_key:'F',output_key:'F',assessment:'原唱和弦譜明示 F、76；76.5 及 152 為近似或倍速記法，保留原 BPM。'},['https://ja.chordwiki.org/wiki/3月9日']);
patch(19,{reference_key:'A / C',assessment:'速度資料約156／半速78，與原76有差距；Key來源A與C衝突，原值保留、調性不填。'},['https://songbpm.com/%40nico-touches-the-walls/horoguramu']);
patch(21,{reference_bpm:'71 / 106 / 142',assessment:'71／142 為倍速；另有106／3拍辨識，涉及拍點單位或錯判。保留原142，Key不採單一自動分析。'},['https://www.snaplyrics.com/song/w-x-y-tani-yuuki-bpm-key']);
patch(23,{reference_key:'Ab',output_key:'Ab',assessment:'和弦譜明示 Ab；74 與另一來源139非精確倍速，保留原139並列待確認。'});
patch(24,{reference_bpm:'66 / 131.7–132',reference_key:'G',output_key:'G',assessment:'兩份編譜支持 G，教學譜標示66，資料庫約132；保留使用者65，網站新歌單預設改66。'},['https://kanpu8.com/chords/sun-and-earth/','https://chord4.com/zh-hant/tabs/36531']);
patch(30,{reference_key:'G（專輯）/ F#（現場候選）',output_key:'G',assessment:'專輯版採譜兩站為G，現場分析F#不能混用；補G參考調性，BPM144仍缺同版交叉證據。'},['https://chord4.com/zh-hant/tabs/10987','https://daydayguitar.blogspot.com/2014/05/p0NmAmbCr4I.html']);
patch(32,{output_bpm:82,reference_bpm:'82 / 164',assessment:'2020專輯資料82，官方MV對應分析82.05，補82；先前81–83視為片源／分析差異。'},['https://trackify.am/track/7d7UecVUtLJzEplx7nh61p/tempo','https://www.snaplyrics.com/song/mixer-7d7UecVU-bpm-key','https://chordu.com/chords-tabs-麋先生mixer-嗜愛動物loveholic-是愛版-official-music-video-id_1OPl-jhic4k']);
patch(37,{reference_bpm:'71 / 85',reference_key:'G（歌手2024）',assessment:'歌手2024片源分析71、編譜85，BPM有實質分歧；須確認演出版本，暫留空。'},['https://chordify.net/chords/ge-shou2024-di-san-qi-chun-xiang-banyellow-huang-xuan-si-nian-singer-2024-third-issue-yellow-huang-xuan-missing-hu-nan-guo-ji-p']);
patch(38,{output_bpm:112,output_key:'Fm',reference_bpm:'112 / 56（MV分析約111）',reference_key:'Fm',assessment:'2018《平凡的一天》4:21專輯及伴奏版皆112、Fm；補112與Fm。MV分析111是小幅估測差異。'},['https://songdata.io/track/7x3WCjRe4YW0z6W1OxOvc1/-by-Mao-Buyi','https://songbpm.com/%40mao-buyi/xiao-chou-Ub5LwXMuRz','https://songbpm.com/%40mao-buyi/xiao-chou-ban-zou-ban']);
patch(39,{reference_bpm:'約69 / 138（2017 Live）',reference_key:'F#（2017 Live候選）',assessment:'找到2017 Live約138.1／半速69；不同版本及原先編譜調性不同，需指定版本。'},['https://trackify.am/track/5WY1CAZrYa6CE4CdnGQoCe/tempo']);
patch(40,{output_bpm:62,output_key:'G',reference_bpm:'62 / 124',reference_key:'G',assessment:'2018《平凡的一天》4:34專輯124、G，專輯對應逐曲分析62、G；採練唱半速62。'},['https://songdata.io/track/41rAj5KImICNXmY5yQ6eid/-by-Mao-Buyi','https://www.youtube.com/watch?v=yOLY3qz8F1Q']);
patch(42,{output_key:'Bb',assessment:'兩份編譜與原專輯調性資料皆支持Bb，含轉調，補起始參考調；BPM79–81估測分歧，留空。'},['https://getsongkey.com/song/yandixingkong/k5mQQY']);
patch(46,{reference_bpm:'105（2014專輯）',reference_key:'Fm（資料庫）/ Eb（編譜）',assessment:'找到2014專輯4:42、105，但仍缺同版本第二份速度證據；Key與編譜不合，兩欄均暫留空。'},['https://songdata.io/track/2JJu8J1kvXs2GbUpQVbZ47/-by-Crowd-Lu','https://kanpu8.com/chords/adult/']);
patch(49,{reference_key:'G（Live）',assessment:'Live逐曲分析71、G，編譜也標G；但歌單未指定Live或其他錄音，保留待確認。'},['https://kanpu8.com/chords/who-live/']);
patch(50,{reference_bpm:'128 / 64；另片源67',reference_key:'D',output_key:'D',assessment:'資料庫及編譜皆D，補參考調性；BPM128與另一片源67非精確倍速，留空。'},['https://chord4.com/zh-hant/tabs/1315','https://chordify.net/chords/huang-jie-xia-yu-de-wan-shang-yi-qi-zhui-xing-qu-party-star-media']);
patch(55,{output_key:'Bb',reference_bpm:'135–136；另分析150',reference_key:'Bb',assessment:'原專輯4:07資料庫136、Bb，原專輯另一站135；排除150仍需點拍，BPM先留空。Bb有編譜與資料支持。'},['https://songbpm.com/%40xiao-yu/zhong-yu-shuo-chu-kou','https://www.youtube.com/watch?v=7QNU5MlemQY']);
patch(56,{output_bpm:97,output_key:'E',reference_bpm:'97 / 97.15',reference_key:'E',assessment:'採譜速度97、原調E，MV逐曲分析97.15，官方教學和弦可交叉核對；補97、E。'},['https://kanpu8.com/chords/fish-papun/']);
patch(57,{reference_bpm:'124 / 129 / 135',reference_key:'Db（專輯資料）',assessment:'查到2018 EP與2020專輯，速度來源124／129／135有實質分歧，需版本或音訊；暫留空。'},['https://songdata.io/track/4RPf2UXrxPXykrCh5owBtz/-by-Yo-Lee','https://open.spotify.com/track/2UcgToLQiO8Lh76FQwtWbq']);
patch(58,{output_key:'Bb',reference_bpm:'132（原聲帶資料）/ 130 / 150',reference_key:'Bb',assessment:'原聲帶4:12–4:13資料庫132，片源分析130與150衝突；BPM留空。Bb與逐曲和弦分析一致，可補參考調性。'},['https://songbpm.com/%40xiao-yu/xiang-ni-de-xi-guan-UhjkgVnkL-','https://music.apple.com/us/album/蜂蜜幸運草-電視原聲帶/843682669']);
patch(60,{reference_key:'Bb',output_key:'Bb',assessment:'原唱和弦譜明示Bb，單曲表速度79與原值相符。'},['https://ja.chordwiki.org/wiki/ひまわりの約束']);
patch(61,{output_bpm:106,reference_bpm:'約106（編譜107）',reference_key:'E / C#m',assessment:'2006單曲表106，官方Lyric Video對應分析105.8，補106；E大調／C#小調為關係調判讀，Key暫不填。'},['https://chordu.com/chords-tabs-ラムジ-lambsey-planet-lyric-video-id_p3V8-bBsN2U']);
patch(63,{reference_key:'Eb',output_key:'Eb',assessment:'原唱和弦譜明示Eb、74，補參考調性，保留原BPM。'});
patch(64,{output_key:'F',assessment:'原專輯資料及第二站皆80、F，補參考調性；161近似倍速，原80維持。'},['https://planetary.music/song-analysis/vaundy/しわあわせ']);
for(let i=0;i<audit.length;i++){
 const a=audit[i],s=songs[i];assert.equal(a.title,s.title);assert.equal(a.artist,s.artist);
 // Existing values in Jen's original export are never replaced.
 if(a.original_bpm!=null)assert.equal(a.original_bpm,a.output_bpm);
 s.bpm=a.output_bpm;s.key=a.output_key;
}
for(const name of ['bpm-key-audit.json','songs-reviewed.json'])fs.writeFileSync(path.join(here,name),JSON.stringify(name.startsWith('bpm')?audit:songs,null,2)+'\n');
const filledBpm=audit.filter(a=>a.original_bpm==null&&a.output_bpm!=null).length,filledKey=songs.filter(s=>s.key).length;
const pending=audit.filter(a=>!a.output_bpm||!a.output_key);
const text=['# 歌單 BPM／Key 核對與更新','',`基準：Jen 提供的 songs_2026-11-17.json，65 首。累計補 ${filledBpm} 首 BPM、${filledKey} 首 Key。尚缺 BPM ${songs.filter(s=>!s.bpm).length} 首、Key ${65-filledKey} 首；〈500W〉風格尚無足夠歌曲層級證據。`,'',
'網站加入「補齊空白資料」功能，按歌名＋歌手精確配對，只補查核結果已核准的空欄。已有的 BPM、Key、風格、狀態、備註、歌詞都保留。更新前會在同一瀏覽器儲存備份，可下載。歌曲詳細頁可展開來源與疑點。', '',
'BPM先以原唱正式版本核對；半速／倍速只是拍點記法，不能直接判錯。Key為參考原曲調性，不是個人演唱移調。多站資料可能共用Spotify上游，沒有直接量測你的伴奏，不宣稱已逐曲聽辨。原有數值有疑點者只提示、不自動覆寫。', '',
'songs-reviewed.json仍可整份匯入，但會替換瀏覽器歌單，若你後來曾編輯，請優先使用網站「補齊空白資料」。未讀取或更動你的瀏覽器歌單。','',
'## 仍缺什麼','', '待確認項目已保留候選數值與來源。版本分歧者需要實際伴奏連結或音訊；其餘可用點拍／鍵盤核對。無須提供私人帳號憑證。','',
'| 歌曲／歌手 | 缺少 | 需要確認 |','|---|---|---|',...pending.map(a=>`| ${a.title}／${a.artist} | ${[!a.output_bpm?'BPM':'',!a.output_key?'Key':''].filter(Boolean).join('、')} | ${a.assessment} |`),'',
'## 逐首資料與來源','', '| 歌曲／歌手 | 原 BPM → 補充檔 | BPM候選 | 參考Key | 判讀與來源 |','|---|---|---|---|---|',...audit.map(a=>`| ${a.title}／${a.artist} | ${a.original_bpm??'空白'} → ${a.output_bpm??'空白'} | ${a.reference_bpm} | ${a.reference_key||'未確認'} | ${a.assessment} ${a.sources.map((url,i)=>`[來源${i+1}](${encodeURI(url)})`).join(' ')} |`),''];
fs.writeFileSync(path.join(here,'核對說明.md'),text.join('\n'));
// Embed approved fills only: reference candidates remain explanatory text.
const embedded=audit.map(a=>({title:a.title,artist:a.artist,bpm:a.output_bpm,key:a.output_key,referenceBpm:a.reference_bpm,referenceKey:a.reference_key,note:a.assessment,sources:a.sources}));
// Existing user-supplied BPM are not independently approved fill candidates.
for(let i=0;i<embedded.length;i++)if(audit[i].original_bpm!=null)embedded[i].bpm=null;
// Confirmed reference tempos may fill a blank in a different/new local songbook.
const approvedBpm={1:74,2:96,4:90,5:55,6:150,8:78,10:125,11:78,12:71,13:77,14:180,16:104,17:100,18:76,19:156,20:135,21:142,22:134,24:66,28:105,29:65,47:95,59:69,60:79,62:155,63:74};
for(const [i,bpm] of Object.entries(approvedBpm))embedded[i].bpm=bpm;
const app=path.join(here,'../index.html');let html=fs.readFileSync(app,'utf8');
const data='/* RESEARCH_DATA_START */\nconst RESEARCH = '+JSON.stringify(embedded,null,1)+';\n/* RESEARCH_DATA_END */';
if(html.includes('/* RESEARCH_DATA_START */'))html=html.replace(/\/\* RESEARCH_DATA_START \*\/[\s\S]*?\/\* RESEARCH_DATA_END \*\//,data);
else html=html.replace('/* ---------- storage ---------- */',data+'\n\n/* ---------- storage ---------- */');
fs.writeFileSync(app,html);
console.log(JSON.stringify({filledBpm,filledKey,missingBpm:songs.filter(s=>!s.bpm).map(s=>s.title+'／'+s.artist),missingKey:65-filledKey}));
