import React, { useEffect, useState } from 'react'
export default function Leaderboard(){
  const [list,setList]=useState([])
  useEffect(()=>{ const raw=localStorage.getItem('quiz_leaderboard'); setList(raw?JSON.parse(raw):[]) },[])
  if(list.length===0) return <div className="card">No leaderboard entries yet.</div>
  return (
    <div className="card">
      <h4>Leaderboard</h4>
      <ol>{list.map((r,i)=>(<li key={i}>{r.name||'Guest'} — {r.score}/{r.total} ({new Date(r.date).toLocaleString()})</li>))}</ol>
    </div>
  )
}
