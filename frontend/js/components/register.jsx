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
        }
        this.onSubmitActivationForm = this.onSubmitActivationForm.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
    }

    onSubmitActivationForm(e) {
        e.preventDefault();
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
                this.setState({verified: true});
            }
            else {
                this.setState({error: data.message});
            }
        })
    }

    onNumberChange(e) {
        this.setState({number: e.target.value});
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
                    <Navbar.Collapse className="justify-content-end">
                        <Button variant="outline-dark" onClick={()=>this.setState({toLogin: true})}>Login</Button>
                    </Navbar.Collapse>
                </Navbar>
                <div className="center-content">
                    <h3 className="center-content-title">Activate Member</h3>
                    {this.state.verified? (
                        <Form>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Firstname"></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Lastname"></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Email"></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Phone number(Optional)"></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control as="select">
                                    <option>Select a school...</option>
                                    <option>UTSC</option>
                                    <option>UTM</option>
                                    <option>UTSG</option>
                                    <option>Ryerson</option>
                                    <option>York</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Username"></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="password" placeholder="Password"></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="password" placeholder="Re-enter password"></Form.Control>
                            </Form.Group>
                            <Button variant="primary">Activate</Button>
                        </Form>
                    ):(
                        <Form onSubmit={this.onSubmitActivationForm}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Member Number" onChange={this.onNumberChange}></Form.Control>
                                <Form.Text>You can find this on your novelty card</Form.Text>
                            </Form.Group>
                            {this.state.loading? (
                                <Button variant="primary" type="submit" disabled>
                                    <Spinner animation="border" role="status" size="sm">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </Button>
                            ):(
                                <Button variant="primary" type="submit">
                                    Verify
                                </Button>
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