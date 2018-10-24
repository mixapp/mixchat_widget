import React, {Component} from 'react';
import Wrapper from '../Wrapper/index';
import Input from '../Input/index';
import Textarea from '../Textarea/index';
import SimpleButton from '../SimpleButton/index';
import './styles.css';
export default class Request extends Component {
    onClickHandle() {
        alert('Call me');
    }
    render() {
        const {nav, color} = this.props;

        return <Wrapper nav={nav} title="Обратный звонок">
            <div className="request">
                <img height="40" src={require('./brain.png')} />
                <div style={{width: '80%'}}>
                    <p className="info">К сожалению, на данный момент все операторы заняты. 
                        Оставьте свое сообщение и мы свяжемся с Вами</p>
                    <Input title="Email" placeholder="ivan@ivanov.ru"/>
                    <Textarea title="Сообщение" placeholder="Введите сообщение..."/>
                    <SimpleButton title="Отправить" onClick={this.onClickHandle.bind(this)} color={color} />
                </div>
                
            </div>
        </Wrapper>
    }
}