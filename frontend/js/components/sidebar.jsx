import Sidebar from 'react-sidebar';
import React from 'react';

export default class ContainerSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: this.props.sidebarOpen,
            sidebarDocked: this.props.sidebarDocked,
        }
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.sidebarOpen && this.props.sidebarOpen) {
            this.setState({
                sidebarOpen: true,
                sidebarDocked: true,
            })
        }
        else if(prevProps.sidebarOpen && !this.props.sidebarOpen) {
            this.setState({
                sidebarOpen: false,
                sidebarDocked: false,
            })
        }
    }

    render() {
        return (
            <Sidebar
                sidebar={this.props.sideComponent}
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                styles={{ sidebar: { background: "white" } }}
            >
                {this.props.component}
            </Sidebar>
        )
    }
}