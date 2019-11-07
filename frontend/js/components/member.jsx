import React from 'react';

export default class Member extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            loading: false,
        }
    }

    componentDidMount() {
    }

    render() {
        if(this.state.loading) {
            return <h4>Loading...</h4>
        }
        if(this.state.type !== 'members') {
            return (
                <div>
                    <h3>Your do not have access to this page</h3>
                    <h3>Please logout first and then login as member</h3>
                </div>
            )
        }
        return (
            <div>
                <h2>Member</h2>
            </div>
        )
    }
}