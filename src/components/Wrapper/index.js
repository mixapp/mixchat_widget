import React, {Component} from 'react';
import './styles.css';

export default class Wrapper extends Component {
    render() {
        const Child = this.props.children;
        const {nav} = this.props;
        return <div className="container">
            <div className="title">
                <div>{this.props.title}</div>
                <div className="close-btn" onClick={() => {nav('button')}}>
                    <img src={require('./close.svg')} />
                </div>
            </div>
            <div className="body">
                {this.props.children}
            </div>
        </div>
    }
}