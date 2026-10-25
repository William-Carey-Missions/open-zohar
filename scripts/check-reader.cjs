const fs=require('node:fs/promises');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const assert=(v,msg)=>{if(!v)throw Error(msg);};
(async()=>{
 const server=http.createServer(async(req,res)=>{
  try{
   const rel=decodeURIComponent(req.url.split('?')[0]);
   const file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));
   if(!file.startsWith(root+path.sep))throw Error('path');
   const data=await fs.readFile(file);
   res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.woff2':'font/woff2','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
   res.end(data);
  }catch{res.statusCode=404;res.end('not found');}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port;
  await page.goto(base+'/#lezen/zohar-i/1a/1');
  await page.waitForSelector('.passage');
  assert(await page.locator('.passage').count()===4,'I 1a heeft vier passages');
  assert((await page.locator('#reader-status').innerText()).includes('Conceptvertaling'),'Conceptstatus ontbreekt');
  assert(await page.locator('.original').first().getAttribute('dir')==='rtl','Grondtekst niet RTL');
  await page.locator('.passage-notes summary').first().click();
  assert((await page.locator('.passage-notes[open]').innerText()).includes('Rabbi Elazar'),'Variantnoot niet zichtbaar');
  await page.evaluate(()=>scrollTo(0,0));
  await fs.mkdir(path.join(root,'.qa'),{recursive:true});
  await page.screenshot({path:path.join(root,'.qa/desktop.png')});
  await page.locator('#next').click();await page.waitForFunction(()=>document.getElementById('chapter-select').value==='1b');
  assert(await page.locator('.passage').count()===8,'I 1b heeft acht passages');
  await page.locator('#previous').click();await page.waitForFunction(()=>document.getElementById('chapter-select').value==='1a');
  await page.locator('#topnav-search-input').fill('roos');await page.locator('#topnav-search-input').press('Enter');
  await page.waitForSelector('#search-results a');
  assert(await page.locator('#search-results a').count()>=3,'Zoeken vindt vertaalde tekst niet');
  await page.goto(base+'/#lezen/zohar-i/3b/1');
  await page.waitForFunction(()=>document.getElementById('chapter-select').value==='3b');
  assert(await page.locator('.passage').count()===2,'3b mag niet volledig lijken');
  assert((await page.locator('#reader-status').innerText()).includes('overige tekst'),'Deeldekking niet vermeld');
  assert(await page.locator('#next').isDisabled(),'Onjuiste volgende pagina');
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/#lezen/zohar-i/1a/1');await page.waitForFunction(()=>document.getElementById('chapter-select').value==='1a');
  await page.evaluate(()=>scrollTo(0,0));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobiele horizontale overloop');
  await page.screenshot({path:path.join(root,'.qa/mobile.png')});
  await page.locator('#settings-open').click();await page.locator('#show-original').uncheck();await page.locator('#settings-close').click();
  assert(!(await page.locator('.original').first().isVisible()),'Grondtekstoptie werkt niet');
  await page.locator('#theme-toggle').click();
  await page.reload();await page.waitForSelector('.passage');
  assert(!(await page.locator('.original').first().isVisible()),'Leesvoorkeur niet bewaard');
  await page.selectOption('#mobile-section','bronnen');
  await page.waitForSelector('#bronnen:visible');
  assert((await page.locator('#bronnen').innerText()).includes('167'),'Bronverantwoording ontbreekt');
  assert(errors.length===0,errors.join('\n'));
  console.log(JSON.stringify({browser:'chromium',desktop:true,mobile:true,search:true,navigation:true,notes:true,partialCoverage:true,preferences:true,pageErrors:errors.length}));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
