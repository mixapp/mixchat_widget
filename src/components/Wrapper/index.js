import React, { Component } from 'react';
import CloseSVG from './close_svg';
import './styles.css';
import * as Api from '../../api';

export default class Wrapper extends Component {
    render() {
        const { nav, color } = this.props;
        return <div className="container">
            <div className="title" style={{ backgroundColor: color }}>
                <div>{this.props.title}</div>
                <div className="close-btn" onClick={() => { Api.callWebhook('jivo_onClose'); nav('button') }}>
                    <CloseSVG />
                </div>
            </div>
            <div className="body">
                {this.props.children}
            </div>
        </div>
    }
}