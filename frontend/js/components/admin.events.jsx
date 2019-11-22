import React from 'react';
import {
    small,
    Badge,
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    InputGroup,
    FormControl,
    FormCheck } from 'react-bootstrap';
import { formattingDate } from '../tools';
import { toast, Slide } from 'react-toastify';
import Select from 'react-select';
import '../../css/admin.events.css';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

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
            members: [],
            admins: [],
            error: '',
            showEventDetailModal: false,
            showNewEventModal: false,
            modalEvent: '',
            newEventTitle: '',
            newEventDescription: '',
            newEventPlace: '',
            newEventCost: '',
            newEventAvailability: true,
            newEventLevel: 'unlimited',
            newEventCollaborate: '',
            newEventChiefs: [],
            newEventAdminHelpers: [],
            newEventMemberHelpers: [],
            newEventSize: '',
            newEventDate: new Date(),
            newEventTime: '12:00',
        }
        this.onShowDetailClick = this.onShowDetailClick.bind(this);
        this.onConfirmEventClick = this.onConfirmEventClick.bind(this);
        this.fetchMembers = this.fetchMembers.bind(this);
    }

    componentDidMount() {
        this.fetchAllEvents(this.fetchMembers);
    }

    fetchAllEvents(callback) {
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
                if(callback) {
                    callback();
                }
                else {
                    this.setState({loading: false});
                }
            }
            else {
                this.setState({error: resp.message, loading: false});
            }
        })
    }

    fetchMembers() {
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
                    allMembers {
                        code,
                        message,
                        data {
                            username,
                            firstname,
                            lastname
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
            const resp = response.data.allMembers;
            if(resp.code === 0) {
                this.setState({members: resp.data});
                this.fetchAdmins();
            }
            else {
                this.setState({error: resp.message, loading: false});
            }
        })
    }

    fetchAdmins() {
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
                    allAdmins {
                        code,
                        message,
                        data {
                            username,
                            firstname,
                            lastname
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
            const resp = response.data.allAdmins;
            if(resp.code === 0) {
                this.setState({admins: resp.data});
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
                                <Card.Text>Estimated size: {e.size? e.size : 'N/A'}</Card.Text>
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
                                <Card.Text>Estimated size: {e2.size? e2.size : 'N/A'}</Card.Text>
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
                                <Card.Text>Estimated size: {e3.size? e3.size : 'N/A'}</Card.Text>
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

    parseUsersToSelect(users) {
        if(!users) {
            return
        }
        let result = [];
        for(var i=0;i<users.length;i++) {
            result.push({
                value: users[i].username,
                label: users[i].username
            })
        }
        return result;
    }

    parseUsersToData(users) {
        let result = [];
        for(var i=0;i<users.length;i++) {
            result.push(users[i].value);
        }
        return JSON.stringify(result);
    }

    onConfirmEventClick() {
        if(!this.state.newEventTitle) {
            toast(`❌Event title cannot be empty`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            return;
        }
        else if(!this.state.newEventDate) {
            toast(`❌Event date cannot be empty`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            return;
        }
        else if(!this.state.newEventTime) {
            toast(`❌Event time cannot be empty`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            return;
        }
        else if(!this.state.newEventPlace) {
            toast(`❌Event place cannot be empty`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            return;
        }
        else if(this.state.newEventCost === '') {
            toast(`❌Event cost cannot be empty`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            return;
        }
        else if(!this.state.newEventChiefs.length) {
            toast(`❌Must have at least one event chief`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            return;
        }
        else {
            fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Auth-Token': localStorage.getItem('X-Auth-Token'),
                },
                body: JSON.stringify({
                    query: `
                    mutation {
                        addEvent(input: {
                            date: "${this.state.newEventDate.toISOString().slice(0, 10).replace(/-/g, "")}"
                            time: "${this.state.newEventTime}"
                            title: "${this.state.newEventTitle}"
                            level: ${this.state.newEventLevel}
                            public: ${this.state.newEventAvailability}
                            chiefs: ${this.parseUsersToData(this.state.newEventChiefs)}
                            place: "${this.state.newEventPlace}"
                            cost: ${this.state.newEventCost}
                            description: ${this.state.newEventDescription? "\""+this.state.newEventDescription+"\"" : null}
                            adminHelpers: ${this.state.newEventAdminHelpers && this.state.newEventAdminHelpers.length > 0? this.parseUsersToData(this.state.newEventAdminHelpers) : null}
                            memberHelpers: ${this.state.newEventMemberHelpers && this.state.newEventMemberHelpers.length > 0? this.parseUsersToData(this.state.newEventMemberHelpers) : null}
                            collaborate: ${this.state.newEventCollaborate? "\""+this.state.newEventCollaborate+"\"" : null}
                        }) {
                            code
                            message
                        }
                    }
                    `
                })
            })
            .then(response => {
                return response.json();
            })
            .then(response => {
                console.log(response);
                const resp = response.data.addEvent;
                if(resp.code === 0) {
                    toast(`✅Successfully added new event`, {
                        autoClose: 3000,
                        transition: Slide,
                        hideProgressBar: true,
                    });
                    this.setState({
                        showNewEventModal: false,
                        newEventTitle: '',
                        newEventDescription: '',
                        newEventPlace: '',
                        newEventCost: '',
                        newEventAvailability: true,
                        newEventLevel: 'unlimited',
                        newEventCollaborate: '',
                        newEventChiefs: [],
                        newEventAdminHelpers: [],
                        newEventMemberHelpers: [],
                        newEventSize: '',
                        newEventDate: new Date(),
                        newEventTime: '12:00',
                    });
                    this.fetchAllEvents();
                }
                else {
                    toast(`❌Error happened when adding new event: ${resp.message}`, {
                        autoClose: 3000,
                        transition: Slide,
                        hideProgressBar: true,
                    });
                }
            })
        }
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
                    <div id="events-upper-buttons">
                        <Button variant="outline-dark" onClick={()=>this.setState({showNewEventModal: true})}>New Event</Button>
                    </div>
                    <Container>
                        {this.renderCards()}
                    </Container>
                </div>
                <Modal show={this.state.showEventDetailModal} onHide={()=>this.setState({showEventDetailModal: false})} scrollable>
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
                        <p>Collaborate: <span>{this.state.modalEvent.collaborate? this.state.modalEvent.collaborate : 'None'}</span></p>
                        <div>
                            Chiefs:
                            <span>
                                <Select
                                    isMulti
                                    defaultValue={this.parseUsersToSelect(this.state.modalEvent.chiefs)}
                                    options={this.parseUsersToSelect(this.state.admins)}
                                    isDisabled
                                />
                            </span>
                        </div>
                        <div>
                            Admin Helpers:
                            <span>
                                <Select
                                    isMulti
                                    defaultValue={this.parseUsersToSelect(this.state.modalEvent.adminHelpers)}
                                    options={this.parseUsersToSelect(this.state.admins)}
                                    isDisabled
                                />
                            </span>
                        </div>
                        <div>
                            Member Helpers:
                            <span>
                                <Select
                                    isMulti
                                    defaultValue={this.parseUsersToSelect(this.state.modalEvent.memberHelpers)}
                                    options={this.parseUsersToSelect(this.state.members)}
                                    isDisabled
                                />
                            </span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.setState({showEventDetailModal: false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showNewEventModal} onHide={()=>
                    this.setState({
                        showNewEventModal: false,
                        showNewEventModal: false,
                        newEventTitle: '',
                        newEventDescription: '',
                        newEventPlace: '',
                        newEventCost: '',
                        newEventAvailability: true,
                        newEventLevel: 'unlimited',
                        newEventCollaborate: '',
                        newEventChiefs: [],
                        newEventAdminHelpers: [],
                        newEventMemberHelpers: [],
                        newEventSize: '',
                        newEventDate: new Date(),
                        newEventTime: '12:00',
                    })} scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title>New Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="required-field">
                            <label>Event title</label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    aria-label="Title"
                                    aria-describedby="basic-addon2"
                                    onChange={e=>this.setState({newEventTitle: e.target.value})}
                                    value={this.state.newEventTitle}
                                />
                            </InputGroup>
                        </div>
                        <div>
                            <label>Description</label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    aria-label="Title"
                                    aria-describedby="basic-addon2"
                                    as="textarea"
                                    onChange={e=>this.setState({newEventDescription: e.target.value})}
                                    value={this.state.newEventDescription}
                                />
                            </InputGroup>
                        </div>
                        <div className="mb-3 required-field">
                            <label>Date</label>
                            <InputGroup>
                                <DatePicker value={this.state.newEventDate} onChange={(e)=>this.setState({newEventDate: e})}/>
                            </InputGroup>
                        </div>
                        <div className="mb-3 required-field">
                            <label>Time</label>
                            <InputGroup>
                                <TimePicker
                                    value={this.state.newEventTime}
                                    onChange={(e)=>this.setState({newEventTime: e})}
                                />
                            </InputGroup>
                        </div>
                        <div className="required-field">
                            <label>Place</label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    aria-label="Place"
                                    aria-describedby="basic-addon2"
                                    onChange={e=>this.setState({newEventPlace: e.target.value})}
                                    value={this.state.newEventPlace}
                                />
                            </InputGroup>
                        </div>
                        <div className="required-field">
                            <label>Cost</label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    aria-label="Cost"
                                    aria-describedby="basic-addon2"
                                    onChange={e=>this.setState({newEventCost: e.target.value})}
                                    value={this.state.newEventCost}
                                />
                            </InputGroup>
                        </div>
                        <div className="required-field mb-3">
                            <label>Chiefs</label>
                            <Select
                                isMulti
                                options={this.parseUsersToSelect(this.state.admins)}
                                onChange={e=>this.setState({newEventChiefs: e})}
                                value={this.state.newEventChiefs}
                            />
                        </div>
                        <div>
                            <div className="required-field"><label>Availability</label></div>
                            <InputGroup className="mb-3">
                                <FormCheck inline label="Public" checked={this.state.newEventAvailability} onClick={e=>this.setState({newEventAvailability: true})}/>
                                <FormCheck inline label="Private" checked={!this.state.newEventAvailability} onClick={e=>this.setState({newEventAvailability: false})}/>
                            </InputGroup>
                        </div>
                        <div className="required-field">
                            <label>Level</label>
                            <InputGroup className="mb-3">
                                <FormControl as="select" value={this.state.newEventLevel} onChange={e=>this.setState({newEventLevel: e.target.value})}>
                                    <option>unlimited</option>
                                    <option>adminOnly</option>
                                    <option>memberOnly</option>
                                    <option>adminAndMember</option>
                                </FormControl>
                            </InputGroup>
                        </div>
                        <div>
                            <label>Collaborate</label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    aria-label="Collaborate"
                                    aria-describedby="basic-addon2"
                                    onChange={e=>this.setState({newEventCollaborate: e.target.value})}
                                    value={this.state.newEventCollaborate}
                                />
                            </InputGroup>
                        </div>
                        <div className="mb-3">
                            <label>Admin helpers</label>
                            <Select
                                isMulti
                                options={this.parseUsersToSelect(this.state.admins)}
                                onChange={e=>this.setState({newEventAdminHelpers: e})}
                                value={this.state.newEventAdminHelpers}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Member helpers</label>
                            <Select
                                isMulti
                                options={this.parseUsersToSelect(this.state.members)}
                                onChange={e=>this.setState({newEventMemberHelpers: e})}
                                value={this.state.newEventMemberHelpers}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onConfirmEventClick}>Add</Button>
                        <Button variant="secondary" onClick={()=>this.setState({showNewEventModal: false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}