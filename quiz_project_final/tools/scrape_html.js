// same as previous scraper; ensure tools/sources.json exists (copy template)
import fs from 'fs';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
const sources = JSON.parse(fs.readFileSync('tools/sources.json','utf8'));
function parseBlock(block){
  const lines = block.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  if(lines.length<2) return null;
  const questionLine = lines[0];
  const optionLines = lines.filter(l=>/^[A-D]\.?\s+/i.test(l) || /^[1-4]\.?\s+/.test(l) || /^\([A-Da-d]\)/.test(l)).slice(0,4);
  if(optionLines.length>=2){
    const options = optionLines.map(l=>l.replace(/^[A-D\(\)\d\.\)\s]*/i,'').trim());
    const ansMatch = block.match(/Ans(?:wer)?[:\s]*([A-D1-4])/i);
    let answerIndex = null;
    if(ansMatch){
      const m = ansMatch[1].toUpperCase();
      if(/[A-D]/.test(m)) answerIndex = m.charCodeAt(0)-65;
      else answerIndex = parseInt(m,10)-1;
    }
    return { question: questionLine, options, answerIndex };
  }
  return null;
}
async function extractFromHtml(html, selector){
  const $ = cheerio.load(html);
  const nodes = selector? $(selector) : $('body');
  const candidates = [];
  nodes.each((i,el)=>{
    const text = $(el).text();
    const parts = text.split(/(?:\n|\r|\r\n)+(?=\s*(?:Q\d+|\d+\.|\d+\)))/g);
    parts.forEach(p=>{
      const q = parseBlock(p);
      if(q) candidates.push(q);
    });
  });
  return candidates;
}
async function scrape(){
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox']});
  const out = [];
  for(const s of sources){
    try{
      console.log('Visiting', s.url);
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36');
      await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 60000 });
      const html = await page.content();
      const cands = await extractFromHtml(html, s.selector);
      cands.forEach((c,idx)=> out.push({ id:`scr-${Date.now()}-${idx}`, question:c.question, options:c.options, answerIndex:c.answerIndex, source: s.url, section_id: s.section_id, subtopic_id: s.subtopic_id }));
      await page.close();
    }catch(e){
      console.error('Error', s.url, e.message);
    }
  }
  await browser.close();
  fs.mkdirSync('data',{recursive:true});
  fs.writeFileSync('data/scraped_drafts.json', JSON.stringify(out, null, 2));
  console.log('Saved', out.length, 'drafts -> data/scraped_drafts.json');
}
scrape();
