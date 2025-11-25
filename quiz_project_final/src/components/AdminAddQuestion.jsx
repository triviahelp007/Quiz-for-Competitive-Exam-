import React, { useState } from 'react'
export default function AdminAddQuestion({ defaultSection='nursing', defaultSubtopic='' }) {
  const [section,setSection] = useState(defaultSection)
  const [subtopic,setSubtopic] = useState(defaultSubtopic)
  const [qid,setQid] = useState('')
  const [question,setQuestion] = useState('')
  const [opts,setOpts] = useState(['','','',''])
  const [answer,setAnswer] = useState(0)
  const [explain,setExplain] = useState('')

  function updateOpt(i,v){ const arr=[...opts]; arr[i]=v; setOpts(arr) }

  function buildCsvRow(){
    const id = qid || `${section}-${subtopic || 'gen'}-${Date.now()}`
    const esc = v => `"${String(v||'').replace(/"/g,'""')}"`
    return [section, subtopic, id, question, opts[0], opts[1], opts[2], opts[3], answer, explain, 'manual'].map(esc).join(',')
  }

  function approveDownload(){
    const row = buildCsvRow() + '\n'
    const blob = new Blob([row], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'approved_append.csv'; document.body.appendChild(a); a.click(); a.remove()
    alert('Question downloaded as CSV row. Add to generated/approved_questions.csv and run csv_to_questions.js')
  }

  return (
    <div className="card">
      <h4>Add Question (single)</h4>
      <div className="small">Section <input value={section} onChange={e=>setSection(e.target.value)} /></div>
      <div className="small">Subtopic <input value={subtopic} onChange={e=>setSubtopic(e.target.value)} /></div>
      <div style={{marginTop:8}}>
        <input placeholder="question id (optional)" value={qid} onChange={e=>setQid(e.target.value)} />
        <textarea placeholder="Question text" value={question} onChange={e=>setQuestion(e.target.value)} rows={3} style={{marginTop:6}} />
        {opts.map((o,i)=>(
          <div key={i} style={{marginTop:6}}>
            <input placeholder={`Option ${i+1}`} value={o} onChange={e=>updateOpt(i,e.target.value)} style={{width:'90%'}} />
            <label style={{marginLeft:8}}>Correct? <input type="radio" checked={answer===i} onChange={()=>setAnswer(i)} /></label>
          </div>
        ))}
        <textarea placeholder="Explanation (optional)" value={explain} onChange={e=>setExplain(e.target.value)} rows={2} style={{marginTop:8}} />
        <div style={{marginTop:8}}>
          <button className="button" onClick={approveDownload}>Approve & Download CSV Row</button>
        </div>
      </div>
    </div>
  )
}
