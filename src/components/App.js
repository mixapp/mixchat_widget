import React from 'react';
import Button from './Button/index';
import Chat from './Chat/index';
import Callback from './Callback/index';
import Request from './Request/index';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 'button',
            lastState: ''
        };
    }
    nav(to) {
        this.setState({
            state: to
        });
    }
    render() {
        const {state, lastState} = this.state;
        const {settings, options} = this.props;
        if (state === 'button') {
            return <Button lastState={lastState} {...settings} nav={this.nav.bind(this)}/>
        }
        if (state === 'chat') {
            return <Chat {...settings} nav={this.nav.bind(this)}/>
        }
        if (state === 'callback') {
            return <Callback nav={this.nav.bind(this)}/>
        }
        if (state === 'request') {
            return <Request nav={this.nav.bind(this)}/>
        }
        return null;
    }
}