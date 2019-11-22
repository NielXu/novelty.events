import React from 'react';
import { formattingDate } from '../tools';
import { Card, Badge, Button } from 'react-bootstrap';


const levelColor = {
    'adminOnly': 'primary',
    'memberOnly': 'warning',
    'adminAndMember': 'info',
    'unlimited': 'success',
}

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            loading: false,
            error: '',
            events: [],
        }
        this.renderUpcomingEvent = this.renderUpcomingEvent.bind(this);
        this.renderUpcomingEventCard = this.renderUpcomingEventCard.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Token': localStorage.getItem('X-Auth-Token'),
            },
            body: JSON.stringify({
                query: `
                {
                    getUpcomingEvent {
                        code
                        message
                        data {
                            _id
                            title
                            date
                            time
                            level
                            public
                            place
                            cost
                            description
                            collaborate
                            size
                            chiefs {
                                username
                                firstname
                                lastname
                                _id
                            }
                            adminHelpers {
                                username
                                firstname
                                lastname
                                _id
                            }
                            memberHelpers {
                                username
                                firstname
                                lastname
                                _id
                            }
                        }
                    }
                }
                `
            })
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            const resp = response.data.getUpcomingEvent;
            console.log(resp);
            if(resp.code === 0) {
                this.setState({events: resp.data});
            }
            else {
                this.setState({error: resp.message});
            }
            this.setState({loading: false});
        })
    }

    renderUpcomingEvent() {
        if(!this.state.events || this.state.events.length === 0) {
            return 'None';
        }
        else {
            return formattingDate(this.state.events[0].date) + ", " + this.state.events[0].time;
        }
    }

    renderUpcomingEventCard() {
        if(!this.state.events || this.state.events.length === 0) {
            return
        }
        const e = this.state.events[0];
        return (
            <div>
                <Card>
                    <Card.Header as="h5">{e.title}</Card.Header>
                    <Card.Body>
                        <Card.Title>{e.description? e.description : 'No description'}</Card.Title>
                        <Card.Text>{formattingDate(e.date)}, {e.time}</Card.Text>
                        <Card.Text>
                            Availability:
                            {e.public? (
                                <Badge variant="primary">Public</Badge>
                            ):(
                                <Badge variant="secondary">Private</Badge>
                            )}
                        </Card.Text>
                        <Card.Text>
                            Level: <Badge variant={levelColor[e.level]}>{e.level}</Badge>
                        </Card.Text>
                        <Card.Text>Place: {e.place}</Card.Text>
                        <Card.Text>Estimated cost: {e.cost}</Card.Text>
                        <Card.Text>Estimated size: {e.size? e.size : 'N/A'}</Card.Text>
                        <Button variant="outline-dark">Detail</Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    render() {
        if(this.state.loading) {
            return <h4>Loading...</h4>
        }
        if(this.state.type !== 'admins') {
            return (
                <div>
                    <h3>Your do not have access to this page</h3>
                    <h3>Please logout first and then login as admin</h3>
                </div>
            )
        }
        return (
            <div>
                <h4>Upcoming event: {this.renderUpcomingEvent()}</h4>
                {this.renderUpcomingEventCard()}
            </div>
        )
    }
}