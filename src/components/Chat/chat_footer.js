import React, { Component } from 'react';
import './styles.css';
import * as Api from '../../api';

class BottomConteinerForm extends Component {
  render() {
    return [
      <div id='textarea-conteiner' key='textarea'>
        <div id='textarea-text' contentEditable onKeyUp={Api.changeComment}></div>
      </div>,
      <div key='send_button' onClick={Api.sendComment}>
        <div className='send-button'></div>
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