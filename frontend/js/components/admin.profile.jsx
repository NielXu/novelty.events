import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { toast, Slide } from 'react-toastify';
import '../../css/admin.profile.css';

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
            readOnly: true,
        }
        this.onFirstnameChange = this.onFirstnameChange.bind(this);
        this.onLastnameChange = this.onLastnameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onSaveUpdateClick = this.onSaveUpdateClick.bind(this);
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

    onFirstnameChange(e) {
        this.setState({firstname: e.target.value});
    }

    onLastnameChange(e) {
        this.setState({lastname: e.target.value});
    }

    onEmailChange(e) {
        this.setState({email: e.target.value});
    }

    onPhoneChange(e) {
        this.setState({phone: e.target.value});
    }

    onSaveUpdateClick() {
        if(!this.state.firstname) {
            this.setState({error: 'First name cannot be empty'});
            return
        }
        else if(!this.state.lastname) {
            this.setState({error: 'Last name cannot be empty'});
            return
        }
        else if(!this.state.email) {
            this.setState({error: 'Email cannot be empty'});
            return
        }
        let updating = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
        }
        if(this.state.phone) {
            updating['phone'] = this.state.phone;
        }
        fetch('/graphql', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Token': localStorage.getItem('X-Auth-Token'),
            },
            body: JSON.stringify({
                query: `
                mutation {
                    updateAdminByUsername(username: "${this.state.username}", input: {
                        firstname: "${this.state.firstname}"
                        lastname: "${this.state.lastname}"
                        email: "${this.state.email}"
                        phone: ${this.state.phone? "\""+this.state.phone+"\"" : null}
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
            const resp = response.data.updateAdminByUsername;
            if(resp.code === 0) {
                toast(`✅Successfully updated profile`, {
                    autoClose: 3000,
                    transition: Slide,
                    hideProgressBar: true,
                });
                this.setState({readOnly: true});
            }
            else {
                this.setState({error: resp.message});
            }
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
                <div id="admin-profile-container">
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={this.state.username}
                            readOnly
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">First name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="First name"
                            aria-describedby="basic-addon1"
                            value={this.state.firstname}
                            readOnly={this.state.readOnly}
                            onChange={this.onFirstnameChange}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Last name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Last name"
                            aria-describedby="basic-addon1"
                            value={this.state.lastname}
                            readOnly={this.state.readOnly}
                            onChange={this.onLastnameChange}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                            value={this.state.email}
                            readOnly={this.state.readOnly}
                            onChange={this.onEmailChange}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Phone</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Phone"
                            aria-describedby="basic-addon1"
                            value={this.state.phone? this.state.phone : ""}
                            readOnly={this.state.readOnly}
                            onChange={this.onPhoneChange}
                        />
                    </InputGroup>
                    <div id="admin-profile-lower-buttons">
                        {this.state.readOnly? (
                            <Button variant="outline-dark" onClick={()=>this.setState({readOnly: false})}>Update</Button>
                        ):(
                            <Button variant="outline-dark" onClick={this.onSaveUpdateClick}>Save</Button>
                        )}
                    </div>
                    {this.state.error && <p className="error-message">{this.state.error}</p>}
                </div>
            </div>
        )
    }
}