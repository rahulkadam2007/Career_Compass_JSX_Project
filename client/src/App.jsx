import React from "react";
import {Routes,Route,Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

function Protected({children}){
  return sessionStorage.getItem("currentUser") ? children : <Navigate to="/login" replace/>;
}
export default function App(){
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/quiz" element={<Protected><Quiz/></Protected>}/>
    <Route path="/result" element={<Protected><Result/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}