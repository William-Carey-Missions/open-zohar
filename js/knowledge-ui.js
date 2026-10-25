(function () {
  'use strict';
  const core = window.OpenZoharKnowledge;
  const make = (tag,value,className) => { const el=document.createElement(tag); el.textContent=value||''; if(className)el.className=className; return el; };
  const labels={woordenboek:'Woordenboek',wiki:'Wiki'};
  const routeFor=entry=>'#'+entry.section+'/'+encodeURIComponent(entry.id);
  window.createKnowledgeUI = function(data,works) {
    const entries=data ? [...data.dictionary,...data.wiki] : [];
    const sources=new Map((data?.sources||[]).map(source=>[source.id,source]));
    const byId=new Map(entries.map(entry=>[entry.section+'/'+entry.id,entry]));
    const dialog=document.getElementById('entry-dialog');
    let readingHash='#lezen/zohar-i/1a/1';
    const link=(href,label,className)=>{const a=make('a',label,className);a.href=href;return a;};
    function sourceList(entry) {
      const list=make('ul','','source-list');
      for(const id of entry.sourceIds||[]) {
        const source=sources.get(id), url=core.safeExternalUrl(source?.url);
        if(!source||!url)continue;
        const li=make('li');li.append(link(url,source.title));if(source.note)li.append(make('small',source.note));list.append(li);
      }
      return list;
    }
    function referenceList(entry) {
      const list=make('ul','','reference-list');
      for(const ref of entry.references||[]) {
        const [workId,chapterId,passageId]=ref.split('/');
        const work=works.find(w=>w.id===workId), ch=work?.chapters.find(c=>c.id===chapterId), passage=ch?.passages.find(p=>p.id===passageId);
        if(!passage)continue;
        const li=make('li');li.append(link('#lezen/'+ref,passage.reference));list.append(li);
      }
      return list;
    }
    function entryBody(entry,container,preview=false) {
      if(entry.original) {
        const original=make('p',entry.original,'lemma-original');original.lang=entry.languageCode||'he';original.dir='rtl';container.append(original);
        container.append(make('p',entry.language+' · '+entry.transliteration,'entry-meta'));
      }
      container.append(make('p',entry.summary,'entry-summary'));
      if(entry.explanation)container.append(make('p',entry.explanation));
      const sections=preview?(entry.sections||[]).slice(0,3):entry.sections||[];
      for(const section of sections) {
        container.append(make('h2',section.title));
        for(const paragraph of section.paragraphs)container.append(make('p',paragraph));
      }
      if(!preview && entry.related?.length) {
        const related=make('div','','related-entries');related.append(make('h2','Verder lezen'));
        for(const ref of entry.related){const item=byId.get(ref);if(item)related.append(link(routeFor(item),item.title));}
        container.append(related);
      }
      const references=referenceList(entry);
      if(references.childElementCount){container.append(make('h2','In de tekst'),references);}
      container.append(make('h2','Bronnen'),sourceList(entry));
      if(!preview)container.append(make('p',entry.status||'Contextgebonden werklemma; onafhankelijke vakcontrole nog open.','entry-meta'));
    }
    function listView(section) {
      const query=document.getElementById(section+'-query').value;
      const kind=section==='wiki'?document.getElementById('wiki-kind').value:'alle';
      const matches=core.searchEntries(entries.filter(e=>e.section===section&&(kind==='alle'||e.kind===kind)),query);
      const list=document.getElementById(section+'-list');list.replaceChildren();
      document.getElementById(section+'-count').textContent=data ? matches.length+' '+(section==='wiki'?'artikelen':'lemma’s') : 'Het naslagwerk kon niet worden geladen. Ververs de pagina om opnieuw te proberen.';
      if(!data)return;
      if(!matches.length)list.append(make('p','Geen resultaten. Probeer een andere spelling of een korter zoekwoord.'));
      for(const entry of matches) {
        const item=link(routeFor(entry),'','entry-card');
        item.append(make('strong',entry.title));
        if(entry.original){const original=make('span',entry.original,'entry-card-original');original.lang=entry.languageCode||'he';original.dir='rtl';item.append(original);}
        item.append(make('small',entry.kind||entry.transliteration),make('p',entry.summary));
        list.append(item);
      }
    }
    function render(section,id) {
      const browse=document.getElementById(section+'-browse'), article=document.getElementById(section+'-article');
      browse.hidden=!!id;article.hidden=!id;article.replaceChildren();
      if(!id){listView(section);return;}
      article.append(link('#'+section,'← Alle '+(section==='wiki'?'artikelen':'lemma’s'),'entry-back'));
      const entry=byId.get(section+'/'+id);
      if(!entry){article.append(make('h1','Artikel niet gevonden'),make('p','Deze verwijzing is onbekend. Kies een artikel uit het overzicht.'));return;}
      article.append(make('p',labels[section]+(entry.kind?' · '+entry.kind:''),'entry-meta'),make('h1',entry.title));
      article.append(link(readingHash,'← Terug naar de gelezen passage','back-to-reading'));
      entryBody(entry,article);
      article.append(link(readingHash,'← Terug naar de gelezen passage','back-to-reading'));
    }
    function linkedParagraph(element,value,language) {
      element.replaceChildren();
      const quotes = [];
      const append = (content, token) => {
        const parent = quotes.at(-1)?.element || element;
        if (!token.id) { parent.append(document.createTextNode(content)); return; }
        const entry=byId.get(token.section+'/'+token.id), a=link(routeFor(entry),content,'knowledge-link');
        a.dataset.entry=token.section+'/'+token.id;a.title=entry.title+' — '+entry.summary;
        a.setAttribute('aria-haspopup','dialog');parent.append(a);
      };
      for(const token of core.tokenize(value,entries,language)) {
        const parts = language === 'nl' ? token.text.split(/([“”‘’])/u) : [token.text];
        for (const part of parts) {
          if (!part) continue;
          if (language === 'nl' && (part === '“' || part === '‘')) {
            const em=make('em','','citation');
            (quotes.at(-1)?.element || element).append(em);
            quotes.push({close:part === '“' ? '”' : '’',element:em});
            append(part,token);
          } else if (language === 'nl' && part === quotes.at(-1)?.close) {
            append(part,token); quotes.pop();
          } else append(part,token);
        }
      }
    }
    document.getElementById('entry-dialog-close').onclick=()=>dialog.close();
    dialog.addEventListener('click',event=>{
      const internal=event.target.closest('a[href^="#"]');
      if(internal && event.button===0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) dialog.close();
    });
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    document.addEventListener('click',event=>{
      const anchor=event.target.closest('.passage a[data-entry]');
      if(!anchor||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const entry=byId.get(anchor.dataset.entry);if(!entry)return;
      event.preventDefault();
      const row=anchor.closest('.passage');
      readingHash='#lezen/'+encodeURIComponent(document.getElementById('work-select').value)+'/'+encodeURIComponent(document.getElementById('chapter-select').value)+'/'+encodeURIComponent(row.id.slice(8));
      document.getElementById('entry-dialog-title').textContent=entry.title;
      const body=document.getElementById('entry-dialog-body');body.replaceChildren();entryBody(entry,body,true);
      const full=document.getElementById('entry-dialog-full');full.href=routeFor(entry);full.textContent='Open volledig '+(entry.section==='wiki'?'wikiartikel':'woordenboeklemma');
      dialog.showModal();dialog.scrollTop=0;
    });
    for(const section of ['woordenboek','wiki'])document.getElementById(section+'-query').addEventListener('input',()=>listView(section));
    document.getElementById('wiki-kind').addEventListener('change',()=>listView('wiki'));
    return {render,linkedParagraph,setReadingHash(hash){readingHash=hash;},search(query,container){
      const results=core.searchEntries(entries,query);
      if(results.length)container.append(make('h2','Woordenboek en wiki'));
      for(const entry of results){const item=link(routeFor(entry),labels[entry.section]+' · '+entry.title);item.append(make('small',entry.summary));container.append(item);}
      return results.length;
    }};
  };
})();
