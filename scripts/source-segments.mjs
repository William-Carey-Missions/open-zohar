// Foliosecties uit de vastgelegde Wikisource-containers, in bronvolgorde.
export function sourceSegments(pages,{maxFolio=Infinity}={}) {
  const values={'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ל':30,'מ':40,'נ':50,'ס':60,'ע':70,'פ':80,'צ':90,'ק':100,'ר':200,'ש':300,'ת':400};
  const result=[];
  const occurrences=new Map();
  for(const witness of pages.filter(p=>p.page.pageid>=261494&&p.page.pageid<=261504)) {
    const marker=/<קטע התחלה=([^>]+)\/>/g;
    let match;
    while((match=marker.exec(witness.content))) {
      const address=match[1].match(/^(.*?)דף ([^ ]+) ([אב])$/);
      if(!address) continue;
      const [,prefix,number,side]=address;
      const numberValue=[...number].reduce((n,c)=>n+(values[c]||0),0);
      if(numberValue>maxFolio) continue;
      const folio=numberValue+(side==='א'?'a':'b');
      const end=witness.content.indexOf('<קטע סוף='+match[1]+'/>',marker.lastIndex);
      if(end<0) throw Error('Eindmarkering ontbreekt: '+witness.page.pageid+' '+match[1]);
      const raw=witness.content.slice(marker.lastIndex,end).replace(/<קטע (?:התחלה|סוף)=[^>]*\/>/g,'').replace(/^={2,}.*?={2,}\s*$/gm,'').replace(/\{\{ממ זהר משולב\|[^}]+\}\}/g,'').trim();
      marker.lastIndex=end;
      const section=match[1];
      const key=witness.page.pageid+'/'+section;
      const occurrence=(occurrences.get(key)||0)+1;
      occurrences.set(key,occurrence);
      result.push({folio,section,kind:prefix.trim()||'hoofdtekst',file:witness.file,pageId:witness.page.pageid,revision:witness.rev.revid,occurrence,raw,paragraphs:raw.split(/\n\s*\n/).filter(p=>p.trim()).map(p=>p.trim())});
    }
  }
  return result;
}

export function plainSource(raw) {
  let illustration=0;
  let value=raw.replace(/\[\[קובץ:[^\]]+\]\]/g,()=> '[איור '+(++illustration)+']').replace(/\{\{'\}\}/g,'′');
  value=value.replace(/\[\[קטגוריה:[^\]]+\]\]/g,'');
  while(/\{\{[^{}]*\}\}/.test(value)) {
    value=value.replace(/\{\{([^{}]*)\}\}/g,(_,body)=>{
      const [name,...args]=body.split('|');
      if(name==='הערה') return '';
      if(['ש','ררר','ססס','רווח קשיח'].includes(name)) return ' ';
      if(['צ','גמט','גמט דגש','הערה בצד'].includes(name)) return args[0]||'';
      if(['ממ','שם'].includes(name)) return '('+args.join(' ')+')';
      if(name==='ממ זהר') return '(זהר '+args.join(' ')+')';
      throw Error('Onbekend bronsjabloon: '+name);
    });
  }
  value=value.replace(/'{2,}/g,'').replace(/<\/?(?:small|big|s)>/g,'').replace(/\s+/g,' ').trim();
  if(/\{\{|\}\}|\[\[|<[^>]+>/.test(value)) throw Error('Onverwerkte bronopmaak: '+value.slice(0,120));
  return value;
}

const key=(s,paragraph)=>[s.pageId,s.revision,s.section,s.occurrence||1,paragraph].join('/');
export function assembleChapters(translations,segments,sha) {
  const chapters=[];
  const seen=new Set();
  for(const tr of translations) for(const chapter of tr.chapters) {
    if(seen.has(chapter.id)) throw Error('Dubbel folio in vertaalbestanden: '+chapter.id);
    seen.add(chapter.id);
    const sources=segments.filter(s=>s.folio===chapter.id);
    if(!sources.length) throw Error('Bronsectie ontbreekt: '+chapter.id);
    const expected=sources.flatMap(s=>s.paragraphs.map((_,i)=>key(s,i+1)));
    const used=[];
    const passages=chapter.passages.map((p,i)=>{
      const ref=p.sourceSegment||{pageId:tr.sourcePageId,revision:tr.sourceRevision,section:sources[0].section,occurrence:1,paragraph:i+1};
      const s=sources.find(s=>s.pageId===ref.pageId&&s.revision===ref.revision&&s.section===ref.section&&(s.occurrence||1)===(ref.occurrence||1));
      const raw=s?.paragraphs[ref.paragraph-1];
      if(!raw||!p.nl?.trim()) throw Error('Bron of vertaling ontbreekt: '+chapter.id+':'+p.id);
      if(ref.file&&ref.file!==s.file) throw Error('Verkeerd bronbestand: '+chapter.id+':'+p.id);
      used.push(key(s,ref.paragraph));
      const {sourceSegment,...entry}=p;
      return {...entry,original:plainSource(raw),lang:'arc',reference:'Zohar I '+chapter.id+':'+p.id,status:'concept',source:{file:s.file,pageId:s.pageId,revision:s.revision,section:s.section,occurrence:s.occurrence,paragraph:ref.paragraph,sha256:sha(raw),url:'https://he.wikisource.org/w/index.php?oldid='+s.revision}};
    });
    if(new Set(used).size!==used.length) throw Error('Dubbele bronalinea: '+chapter.id);
    if(used.some((k,i)=>expected[i]!==k)) throw Error('Bronalinea ontbreekt of staat buiten volgorde: '+chapter.id);
    if(chapter.completeFolio&&used.length!==expected.length) throw Error('Folio onvolledig: '+chapter.id);
    if(chapter.completeFolio&&chapter.sourceCoverageUncertain) throw Error('Onzekere foliodekking mag niet volledig heten: '+chapter.id);
    chapters.push({...chapter,status:'conceptvertaling',coverage:chapter.sourceCoverageUncertain?'Alleen de overgeleverde Sitre Tora-sectie beschikbaar; concordantie met de reguliere hoofdtekst nog open. Deze positie telt niet mee als volledig vertaald folio.':chapter.completeFolio?'Volledig bronfolio met de aanwezige ingebedde secties vertaald; onafhankelijke vakredactie nog open.':passages.length+' van '+expected.length+' alinea’s vertaald; overige tekst op dit folio ontbreekt nog.',passages});
  }
  return chapters.sort((a,b)=>parseInt(a.id)-parseInt(b.id)||a.id.localeCompare(b.id));
}
