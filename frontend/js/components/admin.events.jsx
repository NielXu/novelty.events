import React from 'react';
import { small, Badge, Container, Row, Col, Card, Button, Modal, InputGroup } from 'react-bootstrap';
import { formattingDate } from '../tools';

const levelColor = {
    'adminOnly': 'primary',
    'memberOnly': 'warning',
    'adminAndMember': 'info',
    'unlimited': 'success',
}

export default class AdminEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: this.props.type,
            events: [],
            error: '',
            showEventDetailModal: false,
            modalEvent: '',
        }
        this.onShowDetailClick = this.onShowDetailClick.bind(this);
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
                    allEvents{
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
            const resp = response.data.allEvents;
            if(resp.code === 0) {
                this.setState({events: resp.data});
            }
            else {
                this.setState({error: resp.message});
            }
            this.setState({loading: false});
        })
    }

    renderCards() {
        const events = this.state.events;
        let elements = [];
        let index = 0;
        while(index < events.length) {
            const e = events[index];
            const e2 = events[index+1];
            const e3 = events[index+2];
            elements.push(
                <Row key={index}>
                    {e &&
                    (<Col md>
                        <Card>
                            <Card.Header as="h5">{e.title}</Card.Header>
                            <Card.Body>
                                <Card.Title>{e.description? e.description: 'No description'}</Card.Title>
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
                                <Card.Text>Estimated size: {e.size}</Card.Text>
                                <Button variant="outline-dark" value={index} onClick={this.onShowDetailClick}>Detail</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    )}
                    {e2 &&
                    (<Col md>
                        <Card>
                            <Card.Header as="h5">{e2.title}</Card.Header>
                            <Card.Body>
                                <Card.Title>{e2.description? e2.description: 'No description'}</Card.Title>
                                <Card.Text>{formattingDate(e2.date)}, {e2.time}</Card.Text>
                                <Card.Text>
                                    Availability:
                                    {e2.public? (
                                        <Badge variant="primary">Public</Badge>
                                    ):(
                                        <Badge variant="secondary">Private</Badge>
                                    )}
                                </Card.Text>
                                <Card.Text>
                                    Level: <Badge variant={levelColor[e2.level]}>{e2.level}</Badge>
                                </Card.Text>
                                <Card.Text>Place: {e2.place}</Card.Text>
                                <Card.Text>Estimated cost: {e2.cost}</Card.Text>
                                <Card.Text>Estimated size: {e2.size}</Card.Text>
                                <Button variant="outline-dark" value={index+1} onClick={this.onShowDetailClick}>Detail</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    )}
                    {e3 &&
                    (<Col md>
                        <Card>
                            <Card.Header as="h5">{e3.title}</Card.Header>
                            <Card.Body>
                                <Card.Title>{e3.description? e3.description: 'No description'}</Card.Title>
                                <Card.Text>{formattingDate(e3.date)}, {e3.time}</Card.Text>
                                <Card.Text>
                                    Availability:
                                    {e3.public? (
                                        <Badge variant="primary">Public</Badge>
                                    ):(
                                        <Badge variant="secondary">Private</Badge>
                                    )}
                                </Card.Text>
                                <Card.Text>
                                    Level: <Badge variant={levelColor[e3.level]}>{e3.level}</Badge>
                                </Card.Text>
                                <Card.Text>Place: {e3.place}</Card.Text>
                                <Card.Text>Estimated cost: {e3.cost}</Card.Text>
                                <Card.Text>Estimated size: {e3.size}</Card.Text>
                                <Button variant="outline-dark" value={index+2} onClick={this.onShowDetailClick}>Detail</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    )}
                </Row>
            )
            index += 3;
        }
        return elements;
    }

    onShowDetailClick(e) {
        this.setState({showEventDetailModal: true, modalEvent: this.state.events[e.target.value]});
    }

    render() {
        if(this.state.loading) {
            return <h3>Loading...</h3>
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
                <div>
                    <Container>
                        {this.renderCards()}
                    </Container>
                </div>
                <Modal show={this.state.showEventDetailModal} onHide={()=>this.setState({showEventDetailModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalEvent.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>{this.state.modalEvent.description? this.state.modalEvent.description : "No description"}</h5>
                        <hr/>
                        <p>Date: <span>{formattingDate(this.state.modalEvent.date)}</span></p>
                        <p>Time: <span>{this.state.modalEvent.time}</span></p>
                        <p>
                            Availability: 
                            <span>
                                {this.state.modalEvent.public? (
                                        <Badge variant="primary">Public</Badge>
                                    ):(
                                        <Badge variant="secondary">Private</Badge>
                                )}
                            </span>
                        </p>
                        <p>
                            Level: 
                            <span>
                                <Badge variant={levelColor[this.state.modalEvent.level]}>{this.state.modalEvent.level}</Badge>
                            </span>
                        </p>
                        <p>Place: <span>{this.state.modalEvent.place}</span></p>
                        <p>Estimated cost: <span>{this.state.modalEvent.cost !== null? this.state.modalEvent.cost : 'N/A'}</span></p>
                        <p>Estimated size: <span>{this.state.modalEvent.size? this.state.modalEvent.size : 'N/A'}</span></p>
                        <p>Collaborate: <span>None</span></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.setState({showEventDetailModal: false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}