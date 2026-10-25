import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async p=>JSON.parse(await fs.readFile(root+p,'utf8'));
const check=(condition,message)=>{if(!condition)throw Error(message);};
const hash=text=>createHash('sha256').update(text).digest('hex');
const manifest=await read('data/source-manifest.json');
for(const source of manifest.pages){
 const snapshot=await read(source.file);
 const page=snapshot.query.pages.find(p=>p.pageid===source.pageId);
 check(page?.revisions[0].revid===source.revision,'Bronrevisie wijkt af: '+source.title);
 check(hash(page.revisions[0].slots.main.content)===source.sha256,'Bronhash wijkt af: '+source.title);
 check(source.license==='CC-BY-SA-4.0'&&source.historyUrl&&source.url,'Rechtenverantwoording ontbreekt');
}
for(const catalogue of manifest.catalogues){check(hash(JSON.stringify(await read(catalogue.file)))===catalogue.sha256,'Catalogushash wijkt af: '+catalogue.title);}
execFileSync(process.execPath,['scripts/build-corpus.mjs','--check'],{cwd:root,stdio:'pipe'});
const library=await read('data/library.json');
const progress=await read('data/progress.json');
const corpus=await read('data/corpus.json');
const ids=new Set();
let count=0, complete=0;
for(const work of library.works) for(const ch of work.chapters){
 if(ch.completeFolio)complete++;
 for(const p of ch.passages){
  const id=[work.id,ch.id,p.id].join('/');
  check(!ids.has(id),'Dubbele passage-id: '+id);ids.add(id);
  check(p.original&&p.nl&&p.lang==='arc','Passage mist grondtekst of vertaling');
  check(p.reference==='Zohar I '+ch.id+':'+p.id,'Verwijzing wijkt af');
  check(p.status==='concept','Onterechte redactionele status');
  check(!/[{}]|<[^>]+>/.test(p.original),'Ruwe opmaak zichtbaar');
  check(Array.isArray(p.notes),'Toelichting ontbreekt');
  check(p.source.url.startsWith('https://he.wikisource.org/'),'Bronkoppeling ontbreekt');
  count++;
 }
}
check(count===progress.translatedPassages,'Voortgang telt andere passages');
check(complete===progress.completeDraftFolios.length,'Voortgang telt andere folios');
check(corpus.parts.length===progress.inventoryParts,'Onderdeeltelling wijkt af');
check(corpus.folios.length===progress.mainFolioRegister,'Foliotelling wijkt af');
check(library.progress.completeDraftFolios===complete&&library.progress.translatedPassages===count,'Zichtbare voortgang wijkt af');
check(library.progress.mainFolioRegister===corpus.folios.length,'Zichtbare procentnoemer wijkt af');
check(library.progress.mainDraftPercent===Number((complete/corpus.folios.length*100).toFixed(2)),'Zichtbaar percentage wijkt af');
check(new Set(corpus.parts.map(p=>p.id)).size===corpus.parts.length,'Dubbele corpus-id');
check(progress.complete===false&&progress.independentlyReviewedPassages===0,'Onterechte voltooiingsclaim');
const provenance=await read('SOURCE.json');
check(hash(await fs.readFile(root+'css/openvertaling.css'))===provenance.sha256,'Open Vertaling-basisstylesheet gewijzigd');
const html=await fs.readFile(root+'index.html','utf8');
for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
 const link=match[1].replaceAll('&amp;','&');
 if(/^(https?:|mailto:)/.test(link))continue;
 await fs.access(root+decodeURIComponent(link.split('?')[0]));
}
console.log(JSON.stringify({valid:true,passages:count,completeDraftFolios:complete,sourceRecords:manifest.pages.length,catalogueParts:corpus.parts.length,baseStylesheet:'ongewijzigd'}));
