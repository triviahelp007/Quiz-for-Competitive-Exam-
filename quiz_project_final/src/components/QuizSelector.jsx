import React from 'react'
export default function QuizSelector({ sections, onSelect }) {
  return (
    <div style={{display:'grid',gap:12}}>
      {sections.map(sec=>(
        <div className="card" key={sec.id}>
          <h3>{sec.title}</h3>
          <p className="small">{sec.description}</p>
          <div style={{marginTop:8}}>
            <button className="button" onClick={()=>onSelect({kind:'section', id:sec.id})}>Start Section</button>
            {sec.subtopics && <button className="button" style={{marginLeft:8,background:'#10b981'}} onClick={()=>onSelect({kind:'subtopics', id:sec.id})}>Choose Subtopic</button>}
          </div>
        </div>
      ))}
    </div>
  )
}
