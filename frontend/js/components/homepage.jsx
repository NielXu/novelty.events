import React from 'react';
import { Button, Image, Nav, Navbar } from 'react-bootstrap';
import '../../css/homepage.css';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Novelty-UTSC</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Events</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        {/* <Button variant="outline-primary">Login</Button> */}
                        <Nav.Link href="#login">Login</Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
                <div id="homeLogoContainer">
                    <Image src={"/public/homeLogo.png"} id="homeLogo"/>
                </div>
            </div>
        )
    }
}