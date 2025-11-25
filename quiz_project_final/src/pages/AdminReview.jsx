import React, { useEffect, useState } from 'react'
import AdminAddQuestion from '../components/AdminAddQuestion'
import BulkCsvUploader from '../components/BulkCsvUploader'

export default function AdminReview(){
  const [drafts,setDrafts]=useState([])
  useEffect(()=> {
    fetch('/data/scraped_drafts.json').then(r=>{
      if(r.ok) return r.json()
      return []
    }).then(j=>setDrafts(j||[])).catch(()=>setDrafts([]))
  },[])

  function approve(idx){
    const item = drafts[idx]
    const row = [item.section_id||'', item.subtopic_id||'', item.id||'', item.question||'', ...(item.options||[]).slice(0,4), item.answerIndex||'', item.explanation||'', 'scraped'].map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')
    const blob = new Blob([row+'\n'], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'approved_append.csv'; document.body.appendChild(a); a.click(); a.remove()
    alert('Approved: CSV row downloaded. Commit it to generated/approved_questions.csv in repo.')
  }

  if(drafts.length===0) return (
    <div>
      <AdminAddQuestion />
      <BulkCsvUploader />
      <div className="card">No drafts found (run scraper to create data/scraped_drafts.json)</div>
    </div>
  )

  return (
    <div>
      <AdminAddQuestion />
      <BulkCsvUploader />
      <h3>Admin Review</h3>
      {drafts.slice(0,100).map((d,i)=>(
        <div className="card" key={i} style={{marginBottom:8}}>
          <div className="small">Source: {d.source}</div>
          <h4>{d.question}</h4>
          <ol>{(d.options||[]).map((o,oi)=>(<li key={oi}>{o}</li>))}</ol>
          <div style={{marginTop:8}}>
            <button className="button" onClick={()=>approve(i)}>Approve (download CSV row)</button>
          </div>
        </div>
      ))}
    </div>
  )
}
