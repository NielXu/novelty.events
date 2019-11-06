import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import '../../css/login.css';
import { throwServerError } from 'apollo-link-http-common';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asMember: true,
            username: '',
            password: '',
            error: '',
            success: false,
            loading: true,
        }
        this.onLoginOptionClick = this.onLoginOptionClick.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    componentDidMount() {
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
                if(data.hasOwnProperty('token')) {
                    this.setState({success: true, asMember: data.type === 'members'});
                }
                else {
                    localStorage.removeItem('X-Auth-Token');
                }
                this.setState({loading: false});
            })
        }
    }

    onLoginOptionClick() {
        this.setState({asMember: !this.state.asMember});
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onSubmitForm(e) {
        e.preventDefault();
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
        if(this.state.loading) {
            return <div></div>
        }
        return (
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
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                {this.state.error && <p className="error-message">{this.state.error}</p>}
                {this.state.success && <Redirect push to={this.state.asMember? '/member':'/admin'}></Redirect>}
            </div>
        )
    }
}