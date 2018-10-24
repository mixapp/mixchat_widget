import React, {Component} from 'react';
import Wrapper from '../Wrapper/index';
import './styles.css';
export default class Request extends Component {
    render() {
        const {nav} = this.props;

        return <Wrapper nav={nav} title="Оставьте заявку">
            <div className="callback">
                <p className="info">Операторов нет бла бла...</p>
            </div>
        </Wrapper>
    }
}