import React from 'react';
import Home from './components/homepage';
import Login from './components/login';
import Register from './components/register';
import Container from './component.container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/login" component={Login}></Route>
                    <Route exact path="/register" component={Register}></Route>
                    <Route component={Container}></Route>
                </Switch>
            </Router>
        )
    }
}