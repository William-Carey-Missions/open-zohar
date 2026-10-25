(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('nl');
  function indexed(text) {
    let value = '', offset = 0;
    const starts = [], ends = [];
    for (const character of text) {
      const folded = character.normalize('NFD').replace(/\p{M}/gu, '');
      if (!folded && ends.length) ends[ends.length - 1] = offset + character.length;
      for (const c of folded) { value += c; starts.push(offset); ends.push(offset + character.length); }
      offset += character.length;
    }
    return { value, starts, ends };
  }
  const word = c => !!c && /[\p{L}\p{N}]/u.test(c);
  function tokenize(text, entries, language) {
    text = String(text || '');
    const map = indexed(text), lower = map.value.toLocaleLowerCase('nl'), matches = [];
    for (const entry of entries) for (const alias of entry.match?.[language] || []) {
      const sensitive = entry.caseSensitive && language === 'nl';
      const needle = sensitive ? indexed(alias).value : normalize(alias);
      const haystack = sensitive ? map.value : lower;
      if (!needle) continue;
      let start = haystack.indexOf(needle);
      while (start >= 0) {
        const end = start + needle.length;
        if (!word(haystack[start - 1]) && !word(haystack[end])) matches.push({ start, end, entry });
        start = haystack.indexOf(needle, start + 1);
      }
    }
    matches.sort((a,b) => a.start - b.start || b.end - a.end || a.entry.id.localeCompare(b.entry.id));
    const tokens = [];
    let cursor = 0;
    for (const match of matches) {
      const start = map.starts[match.start], end = map.ends[match.end - 1];
      if (start < cursor) continue;
      if (start > cursor) tokens.push({text:text.slice(cursor,start)});
      tokens.push({text:text.slice(start,end), id:match.entry.id, section:match.entry.section});
      cursor = end;
    }
    if (cursor < text.length) tokens.push({text:text.slice(cursor)});
    return tokens;
  }
  function searchEntries(entries, query) {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    return entries.filter(entry => {
      const haystack = normalize([entry.title,entry.headword,entry.original,entry.transliteration,entry.summary,entry.explanation,...(entry.aliases || []),...(entry.sections || []).flatMap(s=>[s.title,...s.paragraphs])].join(' '));
      return terms.every(term=>haystack.includes(term));
    }).sort((a,b)=>(a.title||a.headword||'').localeCompare(b.title||b.headword||'','nl'));
  }
  function safeExternalUrl(value) {
    try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  }
  const api = {tokenize,searchEntries,normalize,safeExternalUrl};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OpenZoharKnowledge = api;
})(globalThis);
