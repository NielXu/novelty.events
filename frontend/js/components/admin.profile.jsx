import React from 'react';

export default class AdminProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            loading: true,
            error: '',
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
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
                query: `
                {
                    getAdminByToken(token: "${localStorage.getItem('X-Auth-Token')}") {
                        code,
                        message,
                        data {
                            firstname,
                            lastname,
                            username,
                            email,
                            phone
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
            const resp = response.data.getAdminByToken;
            if(resp.code === 0) {
                const data = resp.data[0];
                this.setState({
                    username: data.username,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phone: data.phone,
                })
            }
            else {
                this.setState({error: resp.message});
            }
            this.setState({loading: false});
        })
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
                <h2>Profile</h2>
                <p>{this.state.username}</p>
                <p>{this.state.firstname}</p>
                <p>{this.state.lastname}</p>
                <p>{this.state.email}</p>
                <p>{this.state.phone}</p>
            </div>
        )
    }
}