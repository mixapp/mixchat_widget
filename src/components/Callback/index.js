import React, { Component } from 'react';
import Wrapper from '../Wrapper/index';
import Input from '../Input/index';
import SimpleButton from '../SimpleButton/index';
import * as Api from '../../api';
import './styles.css';
export default class Callback extends Component {
  state = {
    phone: '',
    isSuccess: false
  };
  async onClickHandle() {
    const { phone } = this.state;
    let phoneRe = /^[+0-9-() ]+$/;

    if (!phoneRe.test(phone)) {
      return;
    }
    try {
      await Api.sentCallbackRequest(phone);
      this.setState({ isSuccess: true });
    } catch (err) {
      console.error(err);
    }
  }

  onCloseHandle() {
    this.props.nav('button');
  }

  onChange(e) {
    this.setState({
      phone: e.target.value
    });
  }

  render() {
    const { nav, color } = this.props;
    const { isSuccess, phone } = this.state;
    return <Wrapper nav={nav} color={color} title="Обратный звонок">
      {!isSuccess ? <div className="callback">
        <p className="info">Укажите ваш контактный телефон и мы свяжемся с вами
                в течении нескольких минут</p>
        <div style={{ width: '80%' }}>
          <Input value={phone} onChange={this.onChange.bind(this)} title="Телефон" placeholder="+7 (999) 999-99-99" />
        </div>
        <div style={{ width: '80%', marginTop: '20px' }}>
          <SimpleButton title="Позвонить" onClick={this.onClickHandle.bind(this)} color={color} />
        </div>
      </div> : <div className="callback">
          <div style={{ width: '80%' }}>
            <p className="info">Спасибо, наш оператор перезвонит Вам через несколько минут.</p>
            <SimpleButton title="Закрыть" onClick={this.onCloseHandle.bind(this)} color={color} />
          </div>
        </div>}
    </Wrapper>
  }
}