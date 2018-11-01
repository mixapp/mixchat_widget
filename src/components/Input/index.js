import React, {Component} from 'react';
import './styles.css';
export default class Input extends Component {
    render() {
        const {title, placeholder, onChange, value} = this.props;
        return <div className="omni-input-container">
            {title && <label>{title}</label>}
            <input placeholder={placeholder} className="omni-input" type="text" value={value} onChange={onChange} />
        </div>
    }
}