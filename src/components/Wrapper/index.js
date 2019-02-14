import React, { Component } from 'react';
import CloseSVG from './close_svg';
import './styles.css';

export default class Wrapper extends Component {
    render() {
        const { nav, color } = this.props;
        return <div className="container">
            <div className="title" style={{ backgroundColor: color }}>
                <div>{this.props.title}</div>
                <div className="close-btn" onClick={() => { nav('button') }}>
                    <CloseSVG />
                </div>
            </div>
            <div className="body">
                {this.props.children}
            </div>
        </div>
    }
}