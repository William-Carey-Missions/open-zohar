import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceSegments,assembleChapters,plainSource} from '../scripts/source-segments.mjs';

const page=(id,content)=>({file:'bron.json',page:{pageid:id},rev:{revid:1},content});
const fixture=()=>sourceSegments([
  page(261494,'<קטע התחלה=דף ד א/>eerste\n\ntweede<קטע סוף=דף ד א/>'),
  page(261495,'<קטע התחלה=דף ד א/>derde<קטע סוף=דף ד א/><קטע התחלה=דף ד א/>vierde<קטע סוף=דף ד א/>')
]);
const translation=()=>({chapters:[{id:'4a',completeFolio:true,passages:fixture().flatMap(s=>s.paragraphs.map((_,i)=>({id:String(i+1),nl:'Nederlandse tekst',notes:[],sourceSegment:{...s,paragraph:i+1}})))}]});

test('een doorlopend folio behoudt beide containers en herhaalde secties',()=>{
  const segments=fixture();
  assert.deepEqual(segments.map(s=>s.occurrence),[1,1,2]);
  assert.deepEqual(assembleChapters([translation()],segments,s=>s)[0].passages.map(p=>p.original),['eerste','tweede','derde','vierde']);
});
test('een ontbrekende bronalinea mag niet als volledig folio gelden',()=>{
  const tr=translation();tr.chapters[0].passages.pop();
  assert.throws(()=>assembleChapters([tr],fixture(),s=>s),/onvolledig/);
});
test('ingebedde tekst op hetzelfde folio telt mee voor de volledigheid',()=>{
  const pages=[page(261494,'<קטע התחלה=דף ד א/>hoofdtekst<קטע סוף=דף ד א/><קטע התחלה=מתניתין דף ד א/>ingebed<קטע סוף=מתניתין דף ד א/>')];
  const segments=sourceSegments(pages);
  assert.equal(segments.length,2);
  assert.equal(segments[1].kind,'מתניתין');
  const tr={sourcePageId:261494,sourceRevision:1,chapters:[{id:'4a',completeFolio:true,passages:[{id:'1',nl:'Hoofdtekst',notes:[]}]}]};
  assert.throws(()=>assembleChapters([tr],segments,s=>s),/onvolledig/);
  tr.chapters[0].passages.push({id:'e1',nl:'Ingebed',notes:[],sourceSegment:{pageId:261494,revision:1,section:'מתניתין דף ד א',paragraph:1}});
  assert.equal(assembleChapters([tr],segments,s=>s)[0].completeFolio,true);
  tr.chapters[0].sourceCoverageUncertain=true;
  assert.throws(()=>assembleChapters([tr],segments,s=>s),/Onzekere foliodekking/);
});
test('dubbele bronalinea’s verhogen de vertaaldekking niet',()=>{
  const tr=translation();tr.chapters[0].passages.push(tr.chapters[0].passages[0]);
  assert.throws(()=>assembleChapters([tr],fixture(),s=>s),/Dubbele bronalinea/);
});
test('verkeerde bronrevisies en overgeslagen alinea’s worden geweigerd',()=>{
  const tr=translation();tr.chapters[0].passages[0].sourceSegment.revision=2;
  assert.throws(()=>assembleChapters([tr],fixture(),s=>s),/ontbreekt/);
  const other=translation();other.chapters[0].passages.splice(1,1);
  assert.throws(()=>assembleChapters([other],fixture(),s=>s),/buiten volgorde/);
});
test('bronopmaak verdwijnt terwijl citaat, getalwoord en kanttekening blijven',()=>{
  assert.equal(plainSource('{{צ|tekst}}{{ש}}{{גמט|woord}} {{הערה בצד|(variant)|200px|left}} [[קטגוריה:plaats]]'),'tekst woord (variant)');
  assert.equal(plainSource('tekst{{הערה|noot {{ממ זהר|א|צג|א}}}} slot'),'tekst slot');
  assert.throws(()=>plainSource('{{onbekend|tekst}}'),/Onbekend bronsjabloon/);
});
