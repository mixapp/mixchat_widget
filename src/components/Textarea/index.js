import React, {Component} from 'react';
import './styles.css';
export default class Textarea extends Component {
    render() {
        const {title, placeholder} = this.props;
        return <div className="omni-textarea-container">
            {title && <label>{title}</label>}
            <textarea rows="4" placeholder={placeholder} className="omni-textarea"></textarea>
        </div>
    }
}