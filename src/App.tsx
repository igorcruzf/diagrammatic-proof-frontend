// App.js
import './App.css';
import MainPage from "./components/MainPage/MainPage";
import  { Routes, Route } from "react-router-dom";
import About from "./components/AboutPage/AboutPage";
import MenuButtons from "./components/MenuButtons/MenuButtons";
import React from "react";

function App() {

    return <div className="content">
        <MenuButtons/>
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/about" element={<About/>}/>
        </Routes>
    </div>

}

export default App;
