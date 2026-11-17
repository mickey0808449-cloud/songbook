const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
// Execute data, storage and metadata functions, without browser/event initialization.
const prefix=script.slice(0,script.indexOf('/* ---------- ui state ---------- */'));
const writes=[],disk=new Map();let failKey=null;
const ctx={localStorage:{getItem:k=>disk.get(k)||null,setItem(k,v){if(k===failKey)throw Error('quota');writes.push(k);disk.set(k,v)}},console,structuredClone};
vm.createContext(ctx);vm.runInContext(prefix,ctx);
vm.runInContext('renderHome=()=>{};renderMetadata=()=>{};toast=()=>{};',ctx);
const run=code=>vm.runInContext(code,ctx),plain=value=>JSON.parse(JSON.stringify(value));
const reviewed=JSON.parse(fs.readFileSync(path.join(__dirname,'../research/songs-reviewed.json'),'utf8'));
const audit=JSON.parse(fs.readFileSync(path.join(__dirname,'../research/bpm-key-audit.json'),'utf8'));
assert.equal(reviewed.length,65);
for(let i=0;i<65;i++){
 assert.equal(reviewed[i].bpm,audit[i].output_bpm);
 assert.equal(reviewed[i].key,audit[i].output_key);
 if(audit[i].original_bpm!=null)assert.equal(reviewed[i].bpm,audit[i].original_bpm);
}
ctx.fixture=[{id:'a',title:'test',artist:'A',bpm:null,key:'',status:'practicing',note:'keep',lyrics:'user supplied text',custom:{keep:true}},
 {id:'b',title:'test',artist:'B',bpm:65,key:'custom key',status:'base',note:'keep also',lyrics:'other text'},
 {id:'c',title:'unmatched',artist:'C',bpm:null,key:''}];
run('RESEARCH.push({title:"test",artist:"A",bpm:90,key:"G"},{title:"test",artist:"B",bpm:120,key:"D"});songs=structuredClone(fixture)');
assert.deepEqual(plain(run('metadataPlan(songs)')),[{index:0,title:'test',artist:'A',changes:{bpm:90,key:'G'}}]);
assert.equal(run('metadataIdentity({title:"ｔｅｓｔ",artist:" A "})===metadataIdentity(fixture[0])'),true);
assert.equal(run('metadataPlan([fixture[0],{...fixture[0],id:"duplicate"}]).length'),0);
run('applyReviewedMetadata()');
const result=plain(run('songs'));assert.equal(result[0].bpm,90);assert.equal(result[0].key,'G');assert.deepEqual(result[1],ctx.fixture[1]);assert.deepEqual(result[2],ctx.fixture[2]);
for(const key of ['id','status','note','lyrics','custom'])assert.deepEqual(result[0][key],ctx.fixture[0][key]);
assert.deepEqual(writes,['songbook.v1.metadata-backup','songbook.v1']);assert.deepEqual(JSON.parse(disk.get('songbook.v1.metadata-backup')).songs,ctx.fixture);
run('applyReviewedMetadata()');assert.equal(writes.length,2,'repeat application is a no-op');
for(const failing of ['songbook.v1.metadata-backup','songbook.v1']){
 run('songs=structuredClone(fixture)');disk.set('songbook.v1',JSON.stringify(ctx.fixture));failKey=failing;run('applyReviewedMetadata()');
 assert.deepEqual(plain(run('songs')),ctx.fixture);assert.deepEqual(JSON.parse(disk.get('songbook.v1')),ctx.fixture);
}
failKey=null;
run('SEED.splice(0,SEED.length,["same","A","zh","genre A",90,"done"],["same","B","zh","genre B",120,"done"]);songs=[{title:"same",artist:"B",bpm:null,genre:"",status:"practicing"},{title:"same",artist:"A",bpm:65,genre:"",status:"todo"}];mergeSeed()');
assert.deepEqual(plain(run('songs.map(s=>[s.artist,s.bpm,s.genre,s.status])')),[['B',120,'genre B','practicing'],['A',65,'genre A','todo']]);
console.log('PASS: audit consistency, original BPM preserved, exact identity, ambiguous duplicates skipped, blank-only merge, user fields preserved, backup ordering, idempotence, quota failure, same-title seed migration');
