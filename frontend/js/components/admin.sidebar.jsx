import React from 'react';
import { Button } from 'react-bootstrap';

export default class AdminSidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    <Button variant="outline-primary">Events</Button>
                </div>
                <div>
                    <Button variant="outline-primary">Members</Button>
                </div>
                <div>
                    <Button variant="outline-primary">Suggestions</Button>
                </div>
            </div>
        )
    }
}