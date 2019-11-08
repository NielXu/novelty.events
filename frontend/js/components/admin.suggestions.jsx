import React from 'react';

export default class AdminSuggestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: this.props.type,
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
        return <h2>Suggestions</h2>
    }
}