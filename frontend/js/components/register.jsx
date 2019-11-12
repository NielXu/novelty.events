import React from 'react';
import { Navbar, Nav, Form, Button, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class RegisterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            toLogin: false,
            error: '',
            verified: false,
            number: '',
            schools: [],
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            rePassword: '',
            school: 'default',
        }
        this.onSubmitActivationForm = this.onSubmitActivationForm.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
        this.onFirstnameChange = this.onFirstnameChange.bind(this);
        this.onLastnameChange = this.onLastnameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this,this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onRePasswordChange = this.onRePasswordChange.bind(this);
        this.onSchoolChange = this.onSchoolChange.bind(this);
        this.onRegisterSubmit = this.onRegisterSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    {
                        __type(name: "School") {
                            name,
                            enumValues {
                                name
                            }
                        }
                    }
                `
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            this.setState({
                loading: false,
                schools: data.data.__type.enumValues
            });
        })
    }

    onSubmitActivationForm(e) {
        e.preventDefault();
        this.setState({loading: true});
        fetch('/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                number: this.state.number,
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.message === 'Success') {
                this.setState({verified: true, error: ''});
            }
            else {
                this.setState({error: data.message});
            }
            this.setState({loading: false});
        })
    }

    checkRequiredField(key) {
        if(!this.state[key]) {
            return false;
        }
        return true;
    }

    onRegisterSubmit(e) {
        e.preventDefault();
        if(!this.checkRequiredField('firstname')) {
            this.setState({error: 'Firstname cannot be empty'})
            return;
        }
        else if(!this.checkRequiredField('lastname')) {
            this.setState({error: 'Lastname cannot be empty'})
            return;
        }
        else if(!this.checkRequiredField('email')) {
            this.setState({error: 'Email cannot be empty'})
            return;
        }
        else if(!this.checkRequiredField('username')) {
            this.setState({error: 'Username cannot be empty'})
            return;
        }
        else if(!this.checkRequiredField('password')) {
            this.setState({error: 'Password cannot be empty'})
            return;
        }
        else if(!this.checkRequiredField('rePassword')) {
            this.setState({error: 'Re-enter password cannot be empty'})
            return;
        }
        else if(this.state.school === 'default') {
            this.setState({error: 'Must select a school'});
            return;
        }
        else if(this.state.password !== this.state.rePassword) {
            this.setState({error: 'Password mismatched'});
            return;
        }
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                mutation{
                    addMember(input: {
                        number: "${this.state.number}",
                        firstname: "${this.state.firstname}",
                        lastname: "${this.state.lastname}",
                        email: "${this.state.email}",
                        username: "${this.state.username}",
                        password: "${this.state.password}",
                        school: ${this.state.school},
                        phone: ${this.state.phone? "\""+this.state.phone+"\"" : null}
                    }) {
                        status,
                        message,
                        code
                    }
                }
                `
            })
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            const resp = response.data.addMember;
            if(resp.code === 0) {
                console.log('SUCCESS');
            }
        })
    }

    onNumberChange(e) {
        this.setState({number: e.target.value});
    }

    onFirstnameChange(e) {
        this.setState({firstname: e.target.value});
    }

    onLastnameChange(e) {
        this.setState({lastname: e.target.value});
    }

    onEmailChange(e) {
        this.setState({email: e.target.value});
    }

    onPhoneChange(e) {
        this.setState({phone: e.target.value});
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onRePasswordChange(e) {
        this.setState({rePassword: e.target.value});
    }

    onSchoolChange(e) {
        this.setState({school: e.target.value});
    }

    renderSchoolList() {
        let elements = [];
        for(var i=0;i<this.state.schools.length;i++) {
            elements.push(
                <option key={i} value={this.state.schools[i].name}>{this.state.schools[i].name}</option>
            )
        }
        return elements;
    }

    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/">Novelty-UTSC</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#events">Events</Nav.Link>
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end">
                        <Button variant="outline-dark" onClick={()=>this.setState({toLogin: true})}>Login</Button>
                    </Navbar.Collapse>
                </Navbar>
                <div className="center-content">
                    <h3 className="center-content-title">Activate Member</h3>
                    {this.state.verified? (
                        <Form onSubmit={this.onRegisterSubmit}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Firstname" value={this.state.firstname} onChange={this.onFirstnameChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Lastname" value={this.state.lastname} onChange={this.onLastnameChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Email" value={this.state.email} onChange={this.onEmailChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Phone number(Optional)" value={this.state.phone} onChange={this.onPhoneChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control as="select" onChange={this.onSchoolChange}>
                                    <option value="default">Select a school...</option>
                                    {this.renderSchoolList()}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Username" value={this.state.username} onChange={this.onUsernameChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="password" placeholder="Re-enter password" value={this.state.rePassword} onChange={this.onRePasswordChange}></Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">Activate</Button>
                        </Form>
                    ):(
                        <Form onSubmit={this.onSubmitActivationForm}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Member Number" onChange={this.onNumberChange} value={this.state.number}></Form.Control>
                                <Form.Text>You can find this on your novelty card</Form.Text>
                            </Form.Group>
                            {this.state.loading? (
                                <Button variant="primary" type="submit" disabled>
                                    <Spinner animation="border" role="status" size="sm">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </Button>
                            ):(
                                <Button variant="primary" type="submit">Verify</Button>
                        )}
                        </Form>
                    )}
                    {this.state.error && <p className="error-message">{this.state.error}</p>}
                </div>
                {this.state.toLogin && <Redirect push to="/login"/>}
            </div>
        )
    }
}