// App.js
import './App.css';
import MainPage from "./components/MainPage/MainPage";
import  { Routes, Route } from "react-router-dom";
import TutorialPage from "./components/AboutPage/TutorialPage";
import MenuButtons from "./components/MenuButtons/MenuButtons";
import React from "react";

function App() {

    return <div className="content">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <MenuButtons/>
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/tutorial" element={<TutorialPage/>}/>
            <Route path="/about" element={<TutorialPage/>}/>
        </Routes>
    </div>

}

export default App;
