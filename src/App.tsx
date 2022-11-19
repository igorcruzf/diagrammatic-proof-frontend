// App.js
import './App.css';
import MainPage from "./components/MainPage/MainPage";
import  { Routes, Route } from "react-router-dom";
import TutorialPage from "./components/AboutPage/TutorialPage";
import MenuButtons from "./components/MenuButtons/MenuButtons";
import React from "react";

function App() {

    return <div className="content">
        <MenuButtons/>
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/tutorial" element={<TutorialPage/>}/>
        </Routes>
    </div>

}

export default App;
