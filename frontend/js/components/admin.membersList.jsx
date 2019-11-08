import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ReactTable from 'react-bootstrap-table-next';
import { Dropdown, Button } from 'react-bootstrap';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

export default class MemberList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: this.props.type,
            data: [],
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
                    filter: textFilter()
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
        }
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
                        _id,
                        firstname,
                        lastname,
                        username,
                        email,
                        school
                    }
                }`
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            this.setState({loading: false, data: data.data});
        })
    }

    renderMemberList() {
        let elements = [];
        const members = this.state.data.allMembers;
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
                <h2>Members</h2>
                <ReactTable
                    bootstrap4
                    keyField='_id'
                    data={this.state.data.allMembers}
                    columns={this.state.columns}
                    filter={filterFactory()}
                />
            </div>
        )
    }
 }