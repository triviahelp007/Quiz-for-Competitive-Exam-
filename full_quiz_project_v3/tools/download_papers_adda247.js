/*
Download PDFs (if present) from the Adda247 WBCS page.
Saves into tools/pdfs/
*/
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const TARGET = 'https://www.adda247.com/exams/west-bengal/wbcs-previous-year-question-papers/';
async function run(){
  const browser = await puppeteer.launch({ headless:true, args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0');
  await page.goto(TARGET, { waitUntil: 'networkidle2' });
  const links = await page.evaluate(()=>{
    const els = Array.from(document.querySelectorAll('a'));
    return els.map(a=>({href:a.href, text:a.innerText})).filter(x=>x.href && x.href.toLowerCase().endsWith('.pdf'));
  });
  await browser.close();
  fs.mkdirSync('tools/pdfs',{recursive:true});
  for(const l of links){
    const fname = path.basename(new URL(l.href).pathname);
    const out = path.join('tools','pdfs', fname);
    try{
      const res = await axios.get(l.href, { responseType: 'arraybuffer', headers: { 'User-Agent':'Mozilla/5.0' }, timeout:60000 });
      fs.writeFileSync(out, res.data);
      console.log('Downloaded', out);
    }catch(e){
      console.error('Failed', l.href, e.message);
    }
  }
  if(links.length===0) console.log('No direct PDFs found — the page may embed PDFs or require interaction. Consider manual download.');
}
run();
