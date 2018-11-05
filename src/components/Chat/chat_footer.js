import React, { Component } from 'react';
import './styles.css';
import * as Api from '../../api';
import Send_button from '../Button/send_button.svg';


class BottomConteinerForm extends Component {
  render() {
    return [
      <div id='textarea-conteiner' key='textarea'>
        <div id='textarea-text' contentEditable onKeyUp={Api.changeComment}></div>
      </div>,
      <div key='send_button' onClick={Api.sendComment}>
        <img src={Send_button} alt='Send_button' width='32' height='32' alt='send_button' />
      </div>
    ]
  }
}

export default class BottomConteiner extends Component {
  render() {
    return (
      <div className='bottom-conteiner'>
        <BottomConteinerForm />
      </div>
    )
  }
}