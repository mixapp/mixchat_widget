import React, {Component} from 'react';
import './styles.css';
export default class SimpleButton extends Component {
    render() {
        const {title, onClick, color} = this.props;
        return <button className="omni-button" onClick={onClick} style={{background: color}}>{title}</button>
    }
}