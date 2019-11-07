import React from 'react';
import Home from './components/homepage';
import Login from './components/login';
import Container from './component.container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
                    <Route exact path="/admin" component={Container}></Route>
                    <Route exact path="/member" component={Container}></Route>
                </Switch>
            </Router>
        )
    }
}