import React, {Component} from 'react';
import Wrapper from '../Wrapper/index';
import Input from '../Input/index';
import SimpleButton from '../SimpleButton/index';
import './styles.css';
export default class Callback extends Component {
    onClickHandle() {
        alert('Call me');
    }
    render() {
        const {nav, color} = this.props;

        return <Wrapper nav={nav} title="Обратный звонок">
            <div className="callback">
                <p className="info">Укажите ваш контактный телефон и мы свяжемся с вами 
                в течении нескольких минут</p>
                <div style={{width: '80%'}}>
                    <Input title="Телефон" placeholder="+7 (999) 999-99-99"/>
                </div>
                <div style={{width: '80%', marginTop: '20px'}}>
                    <SimpleButton title="Позвонить" onClick={this.onClickHandle.bind(this)} color={color} />
                </div>
            </div>
        </Wrapper>
    }
}