import React from 'react';

export default class MemberList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: this.props.type,
            data: [],
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
                {this.renderMemberList()}
            </div>
        )
    }
 }