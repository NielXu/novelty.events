import React from 'react';
import { Button, Image } from 'react-bootstrap';
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
                <div className="topBar">
                    <Button variant="primary">Login</Button>
                </div>
                <div id="homeLogoContainer">
                    <Image src={"/public/homeLogo.png"} id="homeLogo"/>
                </div>
            </div>
        )
    }
}