import React from 'react';
import { Form, Button, Col, Spinner, Navbar, Nav } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import '../../css/login.css';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asMember: true,
            username: '',
            password: '',
            error: '',
            success: false,
            loading: false,
            toActivate: false,
        }
        this.onLoginOptionClick = this.onLoginOptionClick.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    onLoginOptionClick() {
        this.setState({asMember: !this.state.asMember, error: ''});
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onSubmitForm(e) {
        e.preventDefault();
        this.setState({loading: true});
        fetch('/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                type: this.state.asMember? 'members' : 'admins',
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.hasOwnProperty('token')) {
                localStorage.setItem('X-Auth-Token', data.token);
                this.setState({error: '', success: true});
            }
            else {
                this.setState({error: data.message, success: false});
            }
            this.setState({loading: false});
        })
    }

    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/">Novelty-UTSC</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav className="mr-auto">
                        <Nav.Link href="#events">Events</Nav.Link>
                    </Nav>
                </Navbar>
                <div className="center-content">
                    <h3 className="center-content-title">Novelty Login</h3>
                    <Form onSubmit={this.onSubmitForm}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Control type="text" placeholder="Username" onChange={this.onUsernameChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password" onChange={this.onPasswordChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Row>
                                <Col>
                                    <Form.Check type="checkbox" label="Member" checked={this.state.asMember} onClick={this.onLoginOptionClick}/>
                                </Col>
                                <Col>
                                    <Form.Check type="checkbox" label="Admin" checked={!this.state.asMember} onClick={this.onLoginOptionClick}/>
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        {this.state.loading? (
                            <Button variant="primary" type="submit" disabled>
                                <Spinner animation="border" role="status" size="sm">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </Button>
                        ):(
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        )}
                    </Form>
                    {this.state.asMember && (
                        <div className="login-prompt">
                            <Button variant="link" onClick={()=>this.setState({toActivate: true})}>New member? Activate here</Button>
                        </div>
                    )}
                    {this.state.error && <p className="error-message">{this.state.error}</p>}
                    {this.state.success && <Redirect push to={this.state.asMember? '/member':'/admin'}/>}
                    {this.state.toActivate && <Redirect push to="/register"/>}
                </div>
            </div>
        )
    }
}