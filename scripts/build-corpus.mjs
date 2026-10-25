import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = async p => JSON.parse(await fs.readFile(root+p,'utf8'));
const write = async (p,v) => { const next=JSON.stringify(v,null,2)+'\n'; if(process.argv.includes('--check')) { if(await fs.readFile(root+p,'utf8')!==next) throw Error('Gegenereerde data verouderd: '+p); } else await fs.writeFile(root+p,next); };
const sha = value => createHash('sha256').update(value).digest('hex');
const sourceFiles = (await fs.readdir(root+'data/sources')).filter(f=>f.endsWith('.json')).sort();
const pages=[];
for(const file of sourceFiles){
 const data=await read('data/sources/'+file);
 if(data.query?.pages) for(const page of data.query.pages){
  if(!page.revisions?.[0]) continue;
  const rev=page.revisions[0];
  pages.push({file:'data/sources/'+file,page,rev,content:rev.slots.main.content});
 }
}
const catalogueFiles=sourceFiles.filter(f=>f.endsWith('-sefaria-index.json'));
const catalogues=[];
for(const file of catalogueFiles){const data=await read('data/sources/'+file);catalogues.push({file:'data/sources/'+file,title:data.title,url:'https://www.sefaria.org/api/v2/raw/index/'+encodeURIComponent(data.title),retrieved:'2026-10-25',sha256:sha(JSON.stringify(data)),hashEncoding:'JSON.stringify van het geparste JSON-object'});}
const manifest=pages.map(({file,page,rev,content})=>({file,pageId:page.pageid,title:page.title,revision:rev.revid,timestamp:rev.timestamp,sha256:sha(content),url:'https://he.wikisource.org/w/index.php?oldid='+rev.revid,historyUrl:'https://he.wikisource.org/w/index.php?title='+encodeURIComponent(page.title)+'&action=history',license:'CC-BY-SA-4.0',attribution:'Bijdragers aan de Hebreeuwse Wikisource; zie gekoppelde paginageschiedenis.'}));
await write('data/source-manifest.json',{date:'2026-10-25',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',pages:manifest,catalogues});
const tr=await read('data/translations/zohar-i-introduction.json');
const witness=pages.find(p=>p.page.pageid===tr.sourcePageId && p.rev.revid===tr.sourceRevision);
if(!witness) throw Error('Vastgelegde bronrevisie ontbreekt');
function paragraphs(section){
 const start=witness.content.indexOf('<קטע התחלה=דף '+section+'/>');
 const end=witness.content.indexOf('<קטע סוף=דף '+section+'/>',start);
 if(start<0||end<0) throw Error('Bronsectie ontbreekt: '+section);
 return witness.content.slice(start,end).replace(/<קטע (?:התחלה|סוף)=[^>]*\/>/g,'').replace(/^={2,}.*?={2,}\s*$/gm,'').replace(/\{\{ממ זהר משולב\|[^}]+\}\}/g,'').trim().split(/\n\s*\n/).filter(p=>p.trim()).map(p=>p.trim());
}
function plain(raw){
 let value=raw.replace(/\{\{הערה\|[\s\S]*?\}\}/g,'');
 value=value.replace(/\{\{ממ\|([^{}]+)\}\}/g,(_,v)=>'('+v.replaceAll('|',' ')+')');
 value=value.replace(/\{\{צ\|([^{}]+)\}\}/g,'$1').replace(/'{2,}/g,'').replace(/<\/?small>/g,'').replace(/\s+/g,' ').trim();
 if(/\{\{|\}\}|<[^>]+>/.test(value)) throw Error('Onverwerkte bronopmaak');
 return value;
}
const sections={'1a':'א א','1b':'א ב','2a':'ב א','2b':'ב ב'};
const chapters=tr.chapters.map(ch=>{
 const raw=paragraphs(sections[ch.id]);
 if(ch.completeFolio && raw.length!==ch.passages.length) throw Error('Folio onvolledig: '+ch.id);
 return {id:ch.id,title:ch.title,status:'conceptvertaling',completeFolio:ch.completeFolio,coverage:ch.completeFolio?'Volledig folio vertaald; onafhankelijke vakredactie nog open.':'Alleen openingsalinea vertaald; overige tekst op dit folio ontbreekt nog.',passages:ch.passages.map((p,i)=>{
  if(!raw[i]||!p.nl?.trim()) throw Error('Bron of vertaling ontbreekt');
  return {...p,original:plain(raw[i]),lang:'arc',reference:'Zohar I '+ch.id+':'+p.id,status:'concept',source:{file:witness.file,pageId:tr.sourcePageId,revision:tr.sourceRevision,section:'דף '+sections[ch.id],paragraph:i+1,sha256:sha(raw[i]),url:'https://he.wikisource.org/w/index.php?oldid='+tr.sourceRevision}};
 })};
});
await write('data/library.json',{version:1,title:'Open Zohar',status:'Deeluitgave — conceptvertaling, corpus niet volledig',works:[{id:'zohar-i',title:'Zohar I · Inleiding',source:'Hebreeuwse Wikisource, זוהר חלק א, revisie 3085399; folioverwijzingen volgens de Mantua-traditie. Bijdragers: zie bron en paginageschiedenis.',sourceUrl:'https://he.wikisource.org/w/index.php?oldid=3085399',historyUrl:'https://he.wikisource.org/w/index.php?title='+encodeURIComponent('זוהר חלק א')+'&action=history',license:'Grondtekst en nieuwe Nederlandse werkvertaling: CC BY-SA 4.0. Bronopmaak vereenvoudigd; varianten afzonderlijk toegelicht.',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',chapters}]});
const title=(n,lang='en')=>n.titles?.find(t=>t.primary&&t.lang===lang)?.text||n.key||'';
const z=await read('data/sources/zohar-sefaria-index.json');
const zc=await read('data/sources/zohar-chadash-sefaria-index.json');
const tk=await read('data/sources/tikkunei-zohar-sefaria-index.json');
const parts=[];
function schemaParts(n,path=[]){
 const next=[...path,n.key];
 if(n.nodes){for(const child of n.nodes) schemaParts(child,next);return;}
 const ref=next.join(', ');
 parts.push({id:'catalogue-'+parts.length,collection:next[0]==='Zohar'?'zohar':'zohar-chadash',title:title(n),titleHe:title(n,'he'),reference:ref,url:'https://www.sefaria.org/'+encodeURIComponent(ref.replaceAll(' ','_')),status:ref==='Zohar, Introduction'?'gedeeltelijk-vertaald-concept':'niet-vertaald',sourceCollation:'open'});
}
schemaParts(z.schema);schemaParts(zc.schema);
for(const n of tk.alt_structs.Tikkunim.nodes){
 if(n.refs?.length){for(const [i,ref] of n.refs.entries()) parts.push({id:'tikkunei-'+(title(n).startsWith('Additional')?'extra-':'')+(i+1),collection:'tikkunei-zohar',title:(title(n).startsWith('Additional')?'Aanvullende tikkoen ':'Tikkoen ')+(i+1),reference:ref,status:'niet-vertaald',sourceCollation:'open'});}
 else parts.push({id:'tikkunei-inleiding-'+parts.length,collection:'tikkunei-zohar',title:title(n).startsWith('Second')?'Tweede inleiding':'Eerste inleiding',reference:n.wholeRef,status:'niet-vertaald',sourceCollation:'open'});
}
const embedded=[];
function walkDaf(n,path=[]){
 const next=title(n)?[...path,title(n)]:path;
 if(n.wholeRef) embedded.push({path:next.join(' / '),reference:n.wholeRef,startingAddress:n.startingAddress||null,refs:n.refs||[],addresses:n.addresses||null,status:'catalogusverwijzing-nog-te-collationeren'});
 for(const child of n.nodes||[]) walkDaf(child,next);
}
walkDaf(z.alt_structs.Daf);
const folios=[];
for(const volume of [1,2,3]){
 const max=volume===1?251:volume===2?269:299;
 for(let daf=volume===1?1:2;daf<=max;daf++) for(const side of ['a','b']){
  if(volume<3&&daf===max&&side==='b') continue;
  const id=daf+side;
  const translated=volume===1?chapters.find(ch=>ch.id===id):null;
  folios.push({reference:'Zohar '+['','I','II','III'][volume]+' '+id,status:translated?(translated.completeFolio?'vertaald-concept':'gedeeltelijk-vertaald-concept'):'niet-vertaald'});
 }
}
const hebrewValues={'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ל':30,'מ':40,'נ':50,'ס':60,'ע':70,'פ':80,'צ':90,'ק':100,'ר':200,'ש':300,'ת':400};
const hebrewNumber=s=>[...s].reduce((n,c)=>n+(hebrewValues[c]||0),0);
const sourceCandidates=new Map();
for(const page of pages.filter(p=>/containers-/.test(p.file))) {
 for(const match of page.content.matchAll(/\{\{ממ זהר משולב\|([^|}]+)\|([^|}]+)\|([^|}]+)\}\}/g)){
  const volume=hebrewNumber(match[1]);
  if(volume<1||volume>3||!['א','ב'].includes(match[3]))continue;
  const ref='Zohar '+['','I','II','III'][volume]+' '+hebrewNumber(match[2])+(match[3]==='א'?'a':'b');
  if(!sourceCandidates.has(ref))sourceCandidates.set(ref,new Set());
  sourceCandidates.get(ref).add(page.page.pageid);
 }
}
for(const folio of folios){
 folio.sourceCandidates=[...(sourceCandidates.get(folio.reference)||[])];
 folio.sourceStatus=folio.sourceCandidates.length?'foliomarkering-aanwezig-niet-gecollationeerd':'geen-foliomarkering-gevonden';
}
const unmarkedFolios=folios.filter(f=>!f.sourceCandidates.length).map(f=>f.reference);
await write('data/corpus.json',{version:1,date:'2026-10-25',scope:'Zohar in drie hoofdvolumes met ingebedde traktaten en afzonderlijke addenda; Zohar Chadasj en Tikkoenei Zohar afzonderlijk. Geen claim van volledigheid van alle handschriften of latere commentaren.',parts,embedded,folios,unmarkedFolios,issues:[{id:'marker-i-10b',status:'open',description:'Zohar I 10b heeft een sectiemarkering in container 261494, maar het verwijssjabloon luidt {{ממ זהר משולב|י|ב|א}} in plaats van een geldige volume/folio/zijde-combinatie. Geen automatisch bewijs van ontbrekende tekst.'},{id:'source-completeness',status:'open',description:'Dertig Wikisource-containers zijn verworven; dit is geen bewijs dat alle folios, ingebedde teksten en addenda aanwezig zijn. Vergelijking met historische druk blijft nodig.'},{id:'tikkun-27',status:'open',description:'De Sefaria-catalogus geeft tikkoen 27 als 12b:2–17b:4, overlappend met de inleiding. Deze catalogusafwijking niet stilzwijgend als bronpaginering overnemen.'},{id:'chadash-pagination',status:'open',description:'Wikisource gebruikt deels vier kolommen per blad, Sefaria een andere indeling. Geen gelijkstelling zonder concordantie.'}]});
await write('data/progress.json',{date:'2026-10-25',complete:false,translatedPassages:chapters.reduce((n,ch)=>n+ch.passages.length,0),completeDraftFolios:chapters.filter(ch=>ch.completeFolio).map(ch=>'Zohar I '+ch.id),partialDraftFolios:['Zohar I 2b: openingsalinea'],independentlyReviewedPassages:0,next:'Zohar I 2b, vanaf פתיחת רב המנונא סבא / בראשית — רב המנונא סבא אמר',remaining:'Alle overige passages van Zohar I–III, de addenda, geheel Zohar Chadasj en geheel Tikkoenei Zohar; onafhankelijke redactie van alle werkvertalingen.',mainFolioRegister:folios.length,untranslatedMainFolios:folios.filter(f=>f.status==='niet-vertaald').length,inventoryParts:parts.length,acquiredMainContainers:30,sourceCompletenessVerified:false,unmarkedMainFolios:unmarkedFolios});
console.log(JSON.stringify({passages:chapters.reduce((n,ch)=>n+ch.passages.length,0),parts:parts.length,folios:folios.length,sourcePages:manifest.length}));
