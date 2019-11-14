import React from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { Nav, Navbar, Button, Image } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import AdminComponent from './components/admin';
import MemberComponent from './components/member';
import Sidebar from './components/sidebar';
import AdminSidebar from './components/admin.sidebar';
import MemberSidebar from './components/member.sidebar';
import MembersListComponent from './components/admin.membersList';
import AdminEvents from './components/admin.events';
import AdminSuggestions from './components/admin.suggestions';
import AdminProfile from './components/admin.profile';

export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unAuth: false,
            loading: true,
            logout: false,
            type: '',
            sidebarOpen: false,
            sidebarDocked: false,
        }
        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
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

    onMenuClick() {
        this.setState({
            sidebarOpen: !this.state.sidebarOpen,
            sidebarDocked: !this.state.sidebarDocked
        })
    }

    onProfileClick() {
        if(this.state.type === 'admins') {
            this.props.history.push('/adminProfile');
        }
        else {
            this.props.history.push('/memberProfile');
        }
    }

    mainComponent() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Nav className="mr-auto">
                        <Button variant="outline-dark" onClick={this.onMenuClick}>
                            <Image src={"public/menuIcon.png"} style={{width: "30px"}}/>
                        </Button>
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text style={{"marginRight": "20px"}}>
                            Signed in as {this.state.type}
                        </Navbar.Text>
                        <Button variant="outline-dark" style={{"marginRight": "20px"}} onClick={this.onProfileClick}>Profile</Button>
                        <Button variant="outline-dark" onClick={this.onLogoutClick}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>
                <Route exact path="/admin" render={() => <AdminComponent type={this.state.type}/>}></Route>
                <Route exact path="/member" render={() => <MemberComponent type={this.state.type}/>}></Route>
                <Route exact path="/memberList" render={() => <MembersListComponent type={this.state.type}/>}></Route>
                <Route exact path="/adminEvents" render={() => <AdminEvents type={this.state.type}/>}></Route>
                <Route exact path="/adminSuggestions" render={() => <AdminSuggestions type={this.state.type}/>}></Route>
                <Route exact path="/adminProfile" render={() => <AdminProfile type={this.state.type}/>}></Route>
            </div>
        )
    }

    render() {
        if(this.state.loading) {
            return <h3>Loading...</h3>
        }
        if(this.state.unAuth) {
            return <Redirect to="/login"/>
        }
        return (
            <div>
                <Sidebar 
                    sidebarOpen={this.state.sidebarOpen}
                    sidebarDocked={this.state.sidebarDocked}
                    component={this.mainComponent()}
                    sideComponent={this.state.type === 'admins'? <AdminSidebar/>:<MemberSidebar/>}
                />
                <ToastContainer/>
                {this.state.logout && <Redirect to="/"/>}
            </div>
        )
    }
}