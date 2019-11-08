import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap';
import '../../css/sidebar.css';

export default class AdminSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toMemberList: false,
            toHome: false,
            toEvents: false,
            toSuggestions: false,
        }
    }

    toMemberList() {
        this.setState({toMemberList: false});
        return <Redirect to="/memberList"/>
    }

    toHome() {
        this.setState({toHome: false});
        return <Redirect to="/admin"/>
    }

    toEvents() {
        this.setState({toEvents: false});
        return <Redirect to="/adminEvents"/>
    }

    toSuggestions() {
        this.setState({toSuggestions: false});
        return <Redirect to="/adminSuggestions"/>
    }

    render() {
        return (
            <div className="home-sidebar">
                <div>
                    <Button variant="outline-light" onClick={()=>this.setState({toHome: true})}>
                        <Image src={"public/homepageIcon.png"} className="sidebar-icon"></Image>
                    </Button>
                    <p className="sidebar-item-text">Home</p>
                </div>
                <div>
                    <Button variant="outline-light" onClick={()=>this.setState({toEvents: true})}>
                        <Image src={"public/eventIcon.png"} className="sidebar-icon"></Image>
                    </Button>
                    <p className="sidebar-item-text">Events</p>
                </div>
                <div className="sidebar-item">
                    <Button variant="outline-light" onClick={()=>this.setState({toMemberList: true})}>
                        <Image src={"/public/communityIcon.png"} className="sidebar-icon"></Image>
                    </Button>
                    <p className="sidebar-item-text">Members</p>
                </div>
                <div>
                    <Button variant="outline-light" onClick={()=>this.setState({toSuggestions: true})}>
                        <Image src={"/public/opinionIcon.png"} className="sidebar-icon"></Image>
                    </Button>
                    <p className="sidebar-item-text">Suggestions</p>
                </div>
                {this.state.toMemberList && this.toMemberList()}
                {this.state.toEvents && this.toEvents()}
                {this.state.toHome && this.toHome()}
                {this.state.toSuggestions && this.toSuggestions()}
            </div>
        )
    }
}