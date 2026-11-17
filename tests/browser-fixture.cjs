// Generate an isolated file for an actual browser smoke test; never use a user's profile.
const fs=require('fs'),path=require('path');
const file=process.argv[2];if(!file)throw Error('Pass output HTML path');
let html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const qa=`
  const result=document.createElement('output');result.id='qa-result';document.body.appendChild(result);
  try{
    const check=(ok,msg)=>{if(!ok)throw Error(msg)};
    const initial=songs;
    check(!document.querySelector('#secDone').hidden,'default done section');
    check(document.querySelector('#secPracticing').hidden,'other section hidden');
    songs=[{id:'qa-a',title:'飛魚',artist:'蘇打綠',lang:'zh',bpm:null,key:'',genre:'流行',status:'practicing',lyrics:'',note:'keep'},
      {id:'qa-b',title:'太陽與地球',artist:'盧廣仲',lang:'zh',bpm:65,key:'my key',genre:'流行',status:'done',lyrics:'',note:'keep me'}];
    renderHome();document.querySelector('#reviewMetadata').click();
    check(document.querySelector('#metadataReview').open,'preview opens');
    check(document.querySelector('#metadataPreview').textContent.includes('127'),'preview BPM');
    check(document.documentElement.scrollWidth<=innerWidth,'no horizontal overflow');
    const before=JSON.stringify(songs);document.querySelector('#applyMetadata').click();
    check(songs[0].bpm===127&&songs[0].key==='D','apply missing fields');
    check(songs[1].bpm===65&&songs[1].key==='my key'&&songs[0].status==='practicing','preserve edits and status');
    check(JSON.stringify(JSON.parse(localStorage.getItem(KEY+'.metadata-backup')).songs)===before,'backup before edits');
    check(!document.querySelector('#downloadMetadataBackup').hidden,'backup downloadable');
    check(document.querySelector('#applyMetadata').disabled,'no-op disabled');
    document.querySelector('[data-section="practicing"]').click();
    check(!document.querySelector('#secPracticing').hidden&&document.querySelector('#secDone').hidden,'section switch works');
    openSong('qa-a');check(document.querySelector('.research-note'),'detail source panel');closeSong();
    songs=initial;activeSection='done';localStorage.removeItem(KEY);localStorage.removeItem(KEY+'.metadata-backup');renderHome();
    result.textContent='PASS: browser default tab, preview, click-to-fill, preservation, backup, no-op, tab switch and detail sources';
  }catch(error){result.textContent='FAIL: '+error.message;}
`;
html=html.replace('load().then(renderHome);','load().then(()=>{renderHome();'+qa+'});');
fs.writeFileSync(file,html);
