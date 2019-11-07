import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default class MemberList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unAuth: false,
            loading: true,
            type: '',
            logout: false,
            data: '',
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
                    this.setState({unAuth: true, loading: false});
                    localStorage.removeItem('X-Auth-Token');
                }
                else {
                    this.setState({type: data.type});
                }
            })
        }
        else {
            this.setState({unAuth: true, loading: false});
        }
        if(!this.state.unAuth) {
            fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Auth-Token': localStorage.getItem('X-Auth-Token'),
                },
                body: JSON.stringify({
                    query: `{
                        allMembers {
                            firstname,
                            lastname,
                            username,
                            email,
                            school
                        }
                    }`
                })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.setState({loading: false, data: data.data});
            })
        }
    }

    onLogoutClick() {
        this.setState({logout: true});
        localStorage.removeItem('X-Auth-Token');
    }

    renderMemberList() {
        let elements = [];
        const members = this.state.data.allMembers;
        for(var i=0;i<members.length;i++) {
            elements.push(
                <div key={members[i].username}>
                    Firstname: <span>{members[i].firstname}</span>
                    Lastname: <span>{members[i].lastname}</span>
                    Username: <span>{members[i].username}</span>
                    School: <span>{members[i].school}</span>
                    Email: <span>{members[i].email}</span>
                </div>
            )
        }
        return elements;
    }

    render() {
        if(this.state.loading) {
            return <h3>Loading...</h3>
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
                <h2>Members</h2>
                {this.renderMemberList()}
                {this.state.unAuth && <Redirect to="/login"/>}
            </div>
        )
    }
 }