// normalize drafts
import fs from 'fs';
import fuzz from 'fuzzball';
const drafts = JSON.parse(fs.readFileSync('data/scraped_drafts.json','utf8')||'[]');
function normalize(d){
  const q = (d.question||'').replace(/\s+/g,' ').trim();
  const options = (d.options||[]).slice(0,4).map(o=> (o||'').replace(/^[A-D\(\)\d\.\)\s]*/i,'').trim());
  while(options.length<4) options.push('');
  let a = typeof d.answerIndex !== 'undefined' ? d.answerIndex : null;
  if(a===null && d.answer){
    const m = String(d.answer).match(/[A-D1-4]/i);
    if(m){
      const c=m[0].toUpperCase();
      a = /[A-D]/.test(c) ? c.charCodeAt(0)-65 : parseInt(c,10)-1;
    }
  }
  return { question: q, options, a, source:d.source, section_id:d.section_id, subtopic_id:d.subtopic_id };
}
const norm = drafts.map(normalize);
const unique = [];
for(const q of norm){
  const dup = unique.find(u => fuzz.ratio(u.question, q.question) > 92);
  if(!dup) unique.push(q);
}
const lines = ['section_id,subtopic_id,question_id,question,option_1,option_2,option_3,option_4,answer_index,explanation,tags'];
unique.forEach((q,i)=>{
  const id = `${q.section_id||'misc'}-${q.subtopic_id||'gen'}-${String(i+1).padStart(4,'0')}`;
  const esc = v=> '"'+String(v||'').replace(/"/g,'""')+'"';
  lines.push([q.section_id||'', q.subtopic_id||'', id, q.question, ...q.options, q.a===null?'':q.a, '', 'scraped'].map(esc).join(','));
});
fs.mkdirSync('generated',{recursive:true});
fs.writeFileSync('generated/scraped_export.csv', lines.join('\n'), 'utf8');
console.log('Wrote generated/scraped_export.csv');
