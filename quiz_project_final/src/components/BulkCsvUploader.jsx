import React, { useState } from 'react'
import Papa from 'papaparse'
export default function BulkCsvUploader(){
  const [preview,setPreview] = useState([])

  function onFile(e){
    const f = e.target.files[0]
    if(!f) return
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => { setPreview(res.data) }
    })
  }

  function approveAll(){
    if(preview.length===0) return alert('No rows')
    const rows = preview.map(row => {
      const esc = v => `"${String(v||'').replace(/"/g,'""')}"`
      return [row.section_id||'', row.subtopic_id||'', row.question_id||'', row.question||'', row.option_1||'', row.option_2||'', row.option_3||'', row.option_4||'', row.answer_index||'', row.explanation||'', row.tags||''].map(esc).join(',')
    })
    const blob = new Blob([rows.join('\n')+'\n'], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='approved_bulk.csv'; a.click(); a.remove()
    alert('Approved CSV prepared for download. Commit to generated/approved_questions.csv')
  }

  return (
    <div className="card">
      <h4>Bulk CSV Uploader</h4>
      <input type="file" accept=".csv" onChange={onFile} />
      <div style={{marginTop:8}}>
        <button className="button" onClick={approveAll}>Approve All & Download</button>
      </div>
      <div style={{marginTop:12}}>
        <small>Preview ({preview.length} rows)</small>
        <pre style={{maxHeight:200,overflow:'auto'}}>{JSON.stringify(preview.slice(0,20),null,2)}</pre>
      </div>
    </div>
  )
}
