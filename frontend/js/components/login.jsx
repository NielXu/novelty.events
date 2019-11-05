import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import '../../css/login.css';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asMember: true,
        }
        this.onLoginOptionClick = this.onLoginOptionClick.bind(this);
    }

    onLoginOptionClick() {
        this.setState({asMember: !this.state.asMember});
    }

    render() {
        return (
            <div className="center-content">
                <h3 className="center-content-title">Novelty Login</h3>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Username" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" />
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
            </div>
        )
    }
}