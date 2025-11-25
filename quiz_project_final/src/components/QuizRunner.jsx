import React, { useState } from 'react'
import QuestionCard from './QuestionCard'
export default function QuizRunner({ items, onFinish }) {
  const [index,setIndex]=useState(0)
  const [score,setScore]=useState(0)
  const [answers,setAnswers]=useState([])
  if(!items||items.length===0) return <div className="card">No questions in this set.</div>
  function handleAnswer(optIdx){
    const current = items[index]
    const correct = current.a===optIdx
    const newAnswers = [...answers,{ qid: current.id, selected: optIdx, correct }]
    setAnswers(newAnswers)
    if(correct) setScore(s=>s+1)
    if(index+1>=items.length) onFinish({ score: correct? score+1: score, total: items.length, answers: newAnswers })
    else setIndex(i=>i+1)
  }
  return (
    <div>
      <QuestionCard q={items[index]} idx={index} total={items.length} onAnswer={handleAnswer} />
      <div className="card small">Progress: {index+1} / {items.length} — Score: {score}</div>
    </div>
  )
}
