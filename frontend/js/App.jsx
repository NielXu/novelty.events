import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            error: '',
        }
    }

    componentDidMount() {
        fetch('/status', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            return response.json();
        })
        .then(js => {
            if(js.status === 'Success') {
                this.setState({status: js.status});
            }
            else{
                this.setState({status: js.status, error: js.error});
            }
        })
    }

    render() {
        if(this.state.status === '') {
            return <div><h2>Hello World!</h2> <h4>Loading...</h4></div>
        }
        return (
            <div>
                <h2>Hello World!</h2>
                <h4>&#10004; Server connection</h4>
                {this.state.status === 'Success' ? (
                    <h4>&#10004; Databse connection</h4>
                ):(
                    <div>
                        <h4>&#10008; Database connection</h4>
                        <p>{this.state.error}</p>
                    </div>
                )}
            </div>
        )
    }
}