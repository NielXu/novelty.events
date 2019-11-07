import React from 'react';
import { Button, Nav, Navbar, Image } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MemberSidebar from './member.sidebar';
import Sidebar from 'react-sidebar';

export default class Member extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: false,
            unAuth: false,
            type: '',
            loading: true,
            sidebarOpen: false,
            sidebarDocked: false,
        }
        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.onSetSidebar = this.onSetSidebar.bind(this);
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

    onSetSidebar(open) {
        this.setState({
            sidebarOpen: !this.state.sidebarOpen,
            sidebarDocked: !this.state.sidebarDocked,
        });
    }

    render() {
        if(this.state.loading) {
            return <h4>Loading...</h4>
        }
        if(!this.state.unAuth && this.state.type !== 'members') {
            return (
                <div>
                    <h3>Your do not have access to this page</h3>
                    <h3>Please logout first and then login as member</h3>
                    <Button variant="primary" onClick={this.onLogoutClick}>Logout</Button>
                    {this.state.logout && <Redirect to="/login"/>}
                </div>
            )
        }
        return (
            <Sidebar
                sidebar={<MemberSidebar/>}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                docked={this.state.sidebarDocked}
                styles={{ sidebar: { background: "white" } }}
            >
            <div>
                <Navbar bg="light" expand="lg">
                    <Nav className="mr-auto">
                        <Button variant="outline-dark" onClick={this.onSetSidebar}>
                            <Image src="https://img.icons8.com/material-sharp/24/000000/menu.png"/>
                        </Button>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text style={{"margin-right": "20px"}}>
                            Signed in as member
                        </Navbar.Text>
                        <Button variant="outline-dark" style={{"margin-right": "20px"}}>Profile</Button>
                        <Button variant="outline-dark" onClick={this.onLogoutClick}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>
                <h2>Member</h2>
                {this.state.logout && <Redirect to="/"/>}
                {this.state.unAuth && <Redirect to="/login"/>}
            </div>
          </Sidebar>
        )
    }
}