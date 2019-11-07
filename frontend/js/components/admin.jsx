import React from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: false,
            unAuth: false,
            type: '',
            loading: true,
        }
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    componentDidMount() {
        // Do a security check when component mount
        if(localStorage.getItem('X-Auth-Token')) {
            fetch('/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'X-Auth-Token': localStorage.getItem('X-Auth-Token'),
                })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(!data.hasOwnProperty('token')) {
                    this.setState({unAuth: true});
                    localStorage.removeItem('X-Auth-Token');
                }
                else {
                    this.setState({type: data.type});
                }
                this.setState({loading: false});
            })
        }
        else {
            this.setState({unAuth: true, loading: false});
        }
    }

    onLogoutClick() {
        this.setState({logout: true});
        localStorage.removeItem('X-Auth-Token');
    }

    render() {
        if(this.state.loading) {
            return <h4>Loading...</h4>
        }
        if(!this.state.unAuth && this.state.type !== 'admins') {
            return (
                <div>
                    <h3>Your do not have access to this page</h3>
                    <h3>Please logout first and then login as admin</h3>
                    <Button variant="primary" onClick={this.onLogoutClick}>Logout</Button>
                    {this.state.logout && <Redirect to="/login"/>}
                </div>
            )
        }
        return (
            <div>
                <h2>Admin</h2>
                <Button variant="primary" onClick={this.onLogoutClick}>Logout</Button>
                {this.state.logout && <Redirect to="/"/>}
                {this.state.unAuth && <Redirect to="/login"/>}
            </div>
        )
    }
}