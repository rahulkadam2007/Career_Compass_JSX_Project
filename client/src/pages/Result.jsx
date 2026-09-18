import React from "react";
import {Link,useNavigate} from "react-router-dom";
function recommendation(score,total){const p=score/total*100;if(p>=80)return["Technology & Software","Your responses show strong interest in problem solving, technology, and analytical activities."];if(p>=60)return["Business & Management","Your responses show a balanced profile with leadership, communication, and decision-making interests."];return["Creative & People-Focused Careers","Your responses indicate interest in communication, creativity, collaboration, and people-oriented activities."];}
export default function Result(){
 const navigate=useNavigate(),d=JSON.parse(sessionStorage.getItem("quizResult")||"null");
 if(!d)return <div className="center-page"><div className="error-card"><h2>No result found</h2><Link className="primary-btn" to="/quiz">Take Quiz</Link></div></div>;
 const percent=Math.round(d.score/d.total*100),[title,text]=recommendation(d.score,d.total);
 return <div className="result-page"><nav className="navbar"><Link className="brand" to="/">🧭 Career Compass</Link><button className="nav-btn" onClick={()=>{sessionStorage.clear();navigate("/")}}>Logout</button></nav>
 <main className="result-container"><div className="result-card"><span className="badge">ASSESSMENT COMPLETE</span><h1>Your Career Assessment Result</h1><div className="score-circle"><strong>{percent}%</strong><span>{d.score} / {d.total}</span></div><h2>Recommended Career Area</h2><div className="recommendation"><h3>🧭 {title}</h3><p>{text}</p></div><div className="result-actions"><Link className="primary-btn" to="/quiz">Retake Quiz</Link><Link className="secondary-btn" to="/">Back Home</Link></div></div></main></div>;
}