import Container from "../Container/Container";
import React from "react";
import './MainPage.css'

export default function MainPage(){

    return <div id={'main-content'}>
        <img id={'logo'} src='images/logo.png' alt="Diagrammatic proof logo"/>
        <Container/>
    </div>
}