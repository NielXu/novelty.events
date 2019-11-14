import React from 'react';
import { Button, Image, Nav, Navbar } from 'react-bootstrap';
import '../../css/homepage.css';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                        <Button variant="outline-dark" onClick={()=>this.props.history.push('/login')}>Login</Button>
                    </Navbar.Collapse>
                </Navbar>
                <div id="homeLogoContainer">
                    <Image src={"/public/homeLogo.png"} id="homeLogo"/>
                </div>
            </div>
        )
    }
}