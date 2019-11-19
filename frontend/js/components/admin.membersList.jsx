import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ReactTable from 'react-bootstrap-table-next';
import { Dropdown, Button, Modal, InputGroup, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { toast, Slide } from 'react-toastify';
import '../../css/memberlist.css';

export default class MemberList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: this.props.type,
            data: [],
            schools: {},
            columns: [],
            showAddCardModal: false,
            number: "",
        }
        this.onAddCardConfirmClick = this.onAddCardConfirmClick.bind(this);
        this.onCardNumberChange = this.onCardNumberChange.bind(this);
    }

    componentDidMount() {
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Token': localStorage.getItem('X-Auth-Token'),
            },
            body: JSON.stringify({
                query: `{
                    allMembers {
                        code,
                        data{
                            _id,
                            firstname,
                            lastname,
                            username,
                            email,
                            school
                        }
                    }
                }`
            })
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            const resp = response.data.allMembers;
            if(resp.code === 0) {
                this.setState({data: resp.data});
                fetch('/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            {
                                __type(name: "School") {
                                    name,
                                    enumValues {
                                        name
                                    }
                                }
                            }
                        `
                    })
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const schoolsList = data.data.__type.enumValues;
                    let schools = {};
                    for(var i=0;i<schoolsList.length;i++) {
                        const school = schoolsList[i];
                        schools[school.name] = school.name;
                    }
                    this.setState({
                        loading: false,
                        schools: schools,
                        columns: [
                            {
                                dataField: 'firstname',
                                text: 'Firstname',
                                filter: textFilter()
                            },
                            {
                                dataField: 'lastname',
                                text: 'Lastname',
                                filter: textFilter()
                            },
                            {
                                dataField: 'username',
                                text: 'Username',
                                filter: textFilter()
                            },
                            {
                                dataField: 'email',
                                text: 'Email',
                                filter: textFilter()
                            },
                            {
                                dataField: 'school',
                                text: 'School',
                                filter: selectFilter({
                                    options: schools
                                })
                            },
                            {
                                dataField: '_id',
                                text: 'Action',
                                formatter: (cell, row, rowIndex, extra) => {
                                    return (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                                More
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#/action-1" value={row._id}>Update</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2" value={row._id}>Contact</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item href="#/action-3" value={row._id}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )
                                }
                            }
                        ]
                    });
                })
            }
        })
    }

    onCardNumberChange(e) {
        this.setState({number: e.target.value});
    }

    onAddCardConfirmClick(e) {
        if(!this.state.number) {
            toast(`❌Card number cannot be empty`, {
                autoClose: 3000,
                transition: Slide,
                hideProgressBar: true,
            });
            this.setState({showAddCardModal: false});
            return
        }
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query:`
                mutation {
                    addCard(input: {
                        number: "${this.state.number}"
                    }) {
                        status,
                        code,
                        message,
                    }
                }
                `
            })
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            const resp = response.data.addCard;
            if(resp.code === 0) {
                toast(`✅Successfully added card: ${this.state.number}`, {
                    autoClose: 3000,
                    transition: Slide,
                    hideProgressBar: true,
                });
            }
            else {
                toast(`❌Error happened when adding card: ${resp.message}`, {
                    autoClose: 3000,
                    transition: Slide,
                    hideProgressBar: true,
                });
            }
            this.setState({
                showAddCardModal: false,
                number: "",
            });
        })
    }

    renderMemberList() {
        let elements = [];
        const members = this.state.data;
        for(var i=0;i<members.length;i++) {
            elements.push(
                <div key={members[i].username}>
                    Firstname: <span>{members[i].firstname}</span>
                    Lastname: <span>{members[i].lastname}</span>
                    Username: <span>{members[i].username}</span>
                    School: <span>{members[i].school}</span>
                    Email: <span>{members[i].email}</span>
                </div>
            )
        }
        return elements;
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
                <div id="memberlist-upper-buttons">
                    <OverlayTrigger
                        placement={"left"}
                        overlay={
                            <Tooltip>
                                🚧Under construction
                            </Tooltip>
                        }
                    >
                        <Button variant="outline-dark">Add Member</Button>
                    </OverlayTrigger>
                    <Button variant="outline-dark" onClick={()=>this.setState({showAddCardModal: true})} style={{marginLeft: '25px'}}>Add Card</Button>
                </div>
                <Modal show={this.state.showAddCardModal} onHide={()=>this.setState({showAddCardModal: false, number: ""})}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Member Card</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon3">
                                Card Number:
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={this.onCardNumberChange} value={this.state.number}/>
                    </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.setState({showAddCardModal: false, number: ""})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.onAddCardConfirmClick}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ReactTable
                    bootstrap4
                    keyField='_id'
                    data={this.state.data}
                    columns={this.state.columns}
                    filter={filterFactory()}
                />
            </div>
        )
    }
 }