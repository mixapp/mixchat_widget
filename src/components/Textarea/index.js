import React, {Component} from 'react';
import './styles.css';
export default class Textarea extends Component {
    render() {
        const {title, placeholder, value, onChange} = this.props;
        return <div className="omni-textarea-container">
            {title && <label>{title}</label>}
            <textarea value={value} onChange={onChange} rows="4" placeholder={placeholder} className="omni-textarea"/>
        </div>
    }
}