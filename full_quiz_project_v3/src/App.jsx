import React, { useState } from 'react'
import { SECTIONS } from './data/questions'
import QuizSelector from './components/QuizSelector'
import QuizRunner from './components/QuizRunner'
import Leaderboard from './components/Leaderboard'
import AdminReview from './pages/AdminReview'

export default function App(){
  const [view,setView]=useState('home')
  const [activeSet,setActiveSet]=useState(null)
  const [result,setResult]=useState(null)

  function handleSelect(payload){
    const sec = SECTIONS.find(s=>s.id===payload.id)
    if(!sec) return
    if(payload.kind==='section'){
      let items = []
      if(sec.subtopics) sec.subtopics.forEach(st=> items.push(...(st.questions||[])))
      else items = sec.questions||[]
      setActiveSet({title:sec.title, items})
      setView('quiz')
    } else if(payload.kind==='subtopics'){
      setView('subtopic-picker'); setActiveSet(sec)
    }
  }

  function handlePickSubtopic(stId){
    const sec = activeSet
    const st = sec.subtopics.find(s=>s.id===stId)
    setActiveSet({title:`${sec.title} — ${st.title}`, items: st.questions})
    setView('quiz')
  }

  return (
    <div className="container">
      <header className="card" style={{marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>QuizHub</h1>
        <div>
          <button className="button" onClick={()=>setView('home')}>Home</button>
          <button className="button" style={{marginLeft:8}} onClick={()=>setView('leaderboard')}>Leaderboard</button>
          <button className="button" style={{marginLeft:8}} onClick={()=>setView('admin')}>Admin</button>
        </div>
      </header>

      {view==='home' && <QuizSelector sections={SECTIONS} onSelect={handleSelect} />}
      {view==='subtopic-picker' && activeSet && (
        <div className="card">
          <h3>Choose subtopic for {activeSet.title}</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8}}>
            {activeSet.subtopics.map(st=>(
              <button key={st.id} className="card" onClick={()=>handlePickSubtopic(st.id)}>{st.title}</button>
            ))}
          </div>
        </div>
      )}

      {view==='quiz' && activeSet && <QuizRunner items={activeSet.items} onFinish={(r)=>{ setResult(r); setView('result') }} />}

      {view==='result' && result && (
        <div className="card">
          <h3>Result</h3>
          <p className="small">You scored {result.score} / {result.total}</p>
          <button className="button" onClick={()=>{ navigator.clipboard.writeText(JSON.stringify(result)); alert('Result copied') }}>Copy JSON</button>
        </div>
      )}

      {view==='leaderboard' && <Leaderboard />}

      {view==='admin' && <AdminReview />}

    </div>
  )
}
