// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Loing/login';// แนะนำให้ปรับเป็นชื่อไฟล์และที่อยู่ที่เป็นไปตามความต้องการ
import Home from './Home/home'; // แนะนำให้ปรับเป็นชื่อไฟล์และที่อยู่ที่เป็นไปตามความต้องการ
import Register from './Loing/register';
import DashBoard from './dashboard/dashboard';
import ProtectedRoute from './HOC/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <ProtectedRoute exact path="/dashboard" component={DashBoard} />
                <ProtectedRoute exact path="/home" component={Home} />
                <Route path="/register" component={Register} />
                <ProtectedRoute exact ="/home" component={Home} />
                {/* <Route path="/dashboard" component={DashBoard} /> */}
            </Switch>
        </Router>
    );
};

export default App;
