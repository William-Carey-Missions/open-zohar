import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(import.meta.url);
const core=require('../js/knowledge-core.js');
const read=async p=>JSON.parse(await fs.readFile(root+p,'utf8'));
const k=await read('data/knowledge.json'), library=await read('data/library.json');
const check=(test,message)=>{if(!test)throw Error(message);};
const entries=[...k.dictionary,...k.wiki], ids=new Set(), sources=new Set();
const passages=new Map();
for(const work of library.works)for(const ch of work.chapters)for(const p of ch.passages)passages.set([work.id,ch.id,p.id].join('/'),p);
for(const source of k.sources){check(core.safeExternalUrl(source.url),'Ongeldige bron-URL');check(!sources.has(source.id),'Dubbele bron-id');sources.add(source.id);}
for(const entry of entries){const id=entry.section+'/'+entry.id;check(!ids.has(id),'Dubbel lemma: '+id);ids.add(id);}
for(const entry of entries){
 check(entry.title&&entry.summary,'Leeg lemma');
 check(entry.sourceIds?.length,'Bron ontbreekt: '+entry.id);
 for(const source of entry.sourceIds)check(sources.has(source),'Onbekende bron: '+source);
 for(const ref of entry.related||[])check(ids.has(ref),'Onbekende verwante verwijzing: '+ref);
 for(const ref of entry.references||[])check(passages.has(ref),'Onbeschikbare tekstverwijzing: '+ref);
}
for(const [ref,p] of passages){
 for(const [language,text] of [['nl',p.nl],['original',p.original]]){
  const tokens=core.tokenize(text,entries,language);
  check(tokens.map(t=>t.text).join('')===text,'Tekst gewijzigd door woordkoppelingen: '+ref);
  for(const token of tokens.filter(t=>t.id))check(ids.has(token.section+'/'+token.id),'Onbekend linkdoel');
 }
 for(const figure of p.illustrations||[])check(core.safeExternalUrl(figure.url),'Ongeldige bronafbeelding');
}
check(passages.get('zohar-i/2b/7').illustrations.length===4,'Vier bronfiguren van de tsadi ontbreken');
check(![...passages.values()].some(p=>/\[\[|\{\{/.test(p.original)),'Ruwe bronopmaak zichtbaar');
console.log(JSON.stringify({valid:true,dictionary:k.dictionary.length,wiki:k.wiki.length,sources:k.sources.length,linkedPassages:passages.size}));
