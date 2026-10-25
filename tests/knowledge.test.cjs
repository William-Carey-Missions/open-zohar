const {test}=require('node:test');
const assert=require('node:assert/strict');
let core;try{core=require('../js/knowledge-core.js');}catch{core={};}
const entries=[
 {id:'chizkia',section:'wiki',match:{nl:['Rabbi Chizkia'],original:['רבי חזקיה']}},
 {id:'rabbi',section:'woordenboek',match:{nl:['Rabbi'],original:['רבי']}},
 {id:'mi',section:'woordenboek',match:{nl:['Mi'],original:['מי']},caseSensitive:true},
 {id:'malchut',section:'woordenboek',title:'Malchoet',original:'מלכות',aliases:['Malkhut'],summary:'Koningschap'},
];
test('een volledige persoonsnaam krijgt voorrang op het woord Rabbi',()=>{
 assert.equal(typeof core.tokenize,'function');
 const result=core.tokenize('Rabbi Chizkia begon.',entries,'nl');
 assert.deepEqual(result.map(t=>[t.text,t.id||null]),[['Rabbi Chizkia','chizkia'],[' begon.',null]]);
});
test('korte trefwoorden blijven buiten andere woorden en behouden hun hoofdletter',()=>{
 assert.equal(typeof core.tokenize,'function');
 assert.deepEqual(core.tokenize('Midden mi Mi.',entries,'nl').filter(t=>t.id).map(t=>t.text),['Mi']);
});
test('Hebreeuwse klinkertekens blijven behouden bij herkenning van een naam',()=>{
 assert.equal(typeof core.tokenize,'function');
 const result=core.tokenize('רַבִּי חזקיה פתח',entries,'original');
 assert.equal(result[0].id,'chizkia');
 assert.equal(result.map(t=>t.text).join(''),'רַבִּי חזקיה פתח');
});
test('zoeken vindt een gevocaliseerde vorm en een alternatieve transliteratie',()=>{
 assert.equal(typeof core.searchEntries,'function');
 assert.equal(core.searchEntries(entries,'מַלְכוּת')[0].id,'malchut');
 assert.equal(core.searchEntries(entries,'Malkhut')[0].id,'malchut');
 assert.equal(core.searchEntries(entries,'onvindbaar').length,0);
});
test('bronlinks accepteren alleen http en https',()=>{
 assert.equal(typeof core.safeExternalUrl,'function');
 assert.equal(core.safeExternalUrl('javascript:alert(1)'),null);
 assert.equal(core.safeExternalUrl('data:text/html,bad'),null);
 assert.equal(core.safeExternalUrl('https://example.org/source'),'https://example.org/source');
});
test('HTML-achtige tekst wordt ongewijzigd als tekstsegmenten teruggegeven',()=>{
 assert.equal(typeof core.tokenize,'function');
 const text='<img src=x onerror=alert(1)> Rabbi Chizkia';
 assert.equal(core.tokenize(text,entries,'nl').map(t=>t.text).join(''),text);
});
