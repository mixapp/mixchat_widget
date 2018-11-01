import React, {Component} from 'react';
import Wrapper from '../Wrapper/index';
import Input from '../Input/index';
import Textarea from '../Textarea/index';
import SimpleButton from '../SimpleButton/index';
import * as Api from '../../api';
import './styles.css';
export default class Request extends Component {
    state = {
        isSuccess: false,
        email: '',
        message: ''
    };
    onClickHandle() {
        const {email, message} = this.state;
        if (!email || !message) {
            return;
        }
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(email)) {
            return;
        }
        try {
            Api.sentRequest(email, message);
            this.setState({isSuccess: true});
        } catch(err) {
            console.error(err);
        }
    }

    onCloseHandle() {
        this.props.nav('button');
    }

    onChange(el, val) {
        let obj = {};
        obj[el] = val;
        this.setState(obj);
    }

    render() {
        const {nav, color} = this.props;
        const {email, message, isSuccess} = this.state;

        return <Wrapper nav={nav} title="Обратный звонок">
            {!isSuccess ? <div className="request">
                <img height="40" src={require('./brain.png')} />
                <div style={{width: '80%'}}>
                    <p className="info">К сожалению, на данный момент все операторы заняты. 
                        Оставьте свое сообщение и мы свяжемся с Вами</p>
                    <Input value={email} onChange={(e) => {this.onChange('email', e.target.value)}} title="Email" placeholder="ivan@ivanov.ru"/>
                    <Textarea value={message} onChange={(e) => {this.onChange('message', e.target.value)}} title="Сообщение" placeholder="Введите сообщение..."/>
                    <SimpleButton title="Отправить" onClick={this.onClickHandle.bind(this)} color={color} />
                </div>    
            </div> : <div className="request">
                <img height="40" src={require('./brain.png')} />
                <div style={{width: '80%'}}>
                    <p className="info">Спасибо, Ваша заявка отправлена. Мы свяжемся с Вами в ближайшее время.</p>
                    <SimpleButton title="Закрыть" onClick={this.onCloseHandle.bind(this)} color={color} />
                </div>    
            </div>}
        </Wrapper>
    }
}