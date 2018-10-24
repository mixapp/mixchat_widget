import React, {Component} from 'react';
import Wrapper from '../Wrapper/index';
import Loader from '../Loader/index';
import * as Api from '../../api';
import './styles.css';
export default class Chat extends Component {
    state = {
        isLoading: true
    }

    async componentDidMount() {
        const {nav} = this.props;
        let isAvailable = false; // Доступность менеджеров, будешь из апи получать

        // Создаем пользователя в рокет чате
        // Сохраняем в куки (через метод в апи)
        
        await Api.timeout(5000);

        if (!isAvailable) {
            // Если операторов нет, переходим на страницу заявки 
            return nav('request');
        }
        
        this.setState({
            isLoading: false
        });
    }

    render() {
        const {nav} = this.props;
        const {isLoading} = this.state;

        return <Wrapper nav={nav} title="Чат с оператором">
            {isLoading ? (<Loader/>) : (<div className="chat">
                <div className="chat-body">
                    Body
                </div>
                <div className="chat-footer">
                    Footer
                </div>
            </div>)}
        </Wrapper>
    }
}