import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Test
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                            allMembers {
                                firstname,
                                lastname
                            }
                        }`
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
    }

    render() {
        return (
            <h2>Hello World!</h2>
        )
    }
}