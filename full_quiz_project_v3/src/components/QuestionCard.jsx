import React from 'react'
export default function QuestionCard({ q, idx, total, onAnswer }) {
  return (
    <div className="card">
      <div className="small">Question {idx+1} / {total}</div>
      <h2>{q.q}</h2>
      <div style={{display:'grid',gap:8,marginTop:12}}>
        {q.options.map((opt,i)=>(
          <button key={i} className="card" onClick={()=>onAnswer(i)} style={{textAlign:'left'}}>{opt}</button>
        ))}
      </div>
    </div>
  )
}
