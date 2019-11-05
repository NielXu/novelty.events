import React from 'react';
import Home from './components/homepage';
import Admin from './components/admin';
import Member from './components/member';
import Login from './components/login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Test
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                            allMembers {
                                firstname,
                                lastname
                            }
                        }`
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/login" component={Login}></Route>
                    <Route exact path="/admin" component={Admin}></Route>
                    <Route exact path="/member" component={Member}></Route>
                </Switch>
            </Router>
        )
    }
}