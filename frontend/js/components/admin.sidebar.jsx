import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default class AdminSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toMemberList: false,
        }
        this.onMemberListClick = this.onMemberListClick.bind(this);
    }

    onMemberListClick() {
        this.setState({toMemberList: true});
    }

    render() {
        return (
            <div>
                <div>
                    <Button variant="outline-primary">Events</Button>
                </div>
                <div>
                    <Button variant="outline-primary" onClick={this.onMemberListClick}>Members</Button>
                </div>
                <div>
                    <Button variant="outline-primary">Suggestions</Button>
                </div>
                {this.state.toMemberList && <Redirect to="/memberList"/>}
            </div>
        )
    }
}