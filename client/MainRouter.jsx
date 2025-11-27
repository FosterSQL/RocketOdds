import routes from './routes';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import RouletteWheel from './components/RouletteWheel';
import RouletteHistory from './components/RouletteHistory';

//CURRENTLY NOT IN USE
function MainRouter() {
    return (
        <div>
            <menu>
                <Routes>
                    <Route path="/*" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </menu>
        </div>
    );
}
export default MainRouter;