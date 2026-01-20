import React from 'react';
import './App.css';
import FullscreenViewer from "./components/Car3DBackgroundPage";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import PeaksMainPage from "./components/PeaksMainPage";
import LocaleMainPage from "./components/LocaleMainPage";
import PlatesMainPage from "./components/PlatesMainPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FullscreenViewer/>}/>
                <Route path="/localeMain" element={<LocaleMainPage/>}></Route>
                <Route path="/platesMain" element={<PlatesMainPage/>}></Route>
                <Route path="/peaksMain" element={<PeaksMainPage/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
