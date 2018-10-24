import React, {Component} from 'react';
import './styles.css';
export default class Loader extends Component {
    render() {
        const {color} = this.props;
        return <div className="loader-container">
        <style dangerouslySetInnerHTML={{
        __html: [
            '.lds-default div {',
            `  background: ${color};`,
            '}'
            ].join('\n')
        }}>
        </style>
        <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    }
}