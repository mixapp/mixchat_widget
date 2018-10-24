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
                <p className="info">К сожалению, на данный момент все менеджеры заняты. 
                Оставьте свои контактные данные, и мы свяжемся с Вами или напишите нам в любой из мессенджеров.</p>
                <div style={{width: '80%'}}>
                    <Input title="Email" placeholder="ivan@ivanov.ru"/>
                    <Textarea title="Сообщение" placeholder="Введите сообщение..."/>
                    <SimpleButton title="Отправить" onClick={this.onClickHandle.bind(this)} color={color} />
                </div>
                
            </div>
        </Wrapper>
    }
}