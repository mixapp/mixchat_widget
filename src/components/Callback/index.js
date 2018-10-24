import React, {Component} from 'react';
import Wrapper from '../Wrapper/index';
import './styles.css';
export default class Callback extends Component {
    render() {
        const {nav} = this.props;

        return <Wrapper nav={nav} title="Обратный звонок">
            <div className="callback">
                <p className="info">Укажите ваш контактный телефон, и мы свяжемся с вами 
                в течении нескольких минут</p>
            </div>
        </Wrapper>
    }
}