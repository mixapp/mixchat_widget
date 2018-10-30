import React, { Component } from 'react';
import './styles.css';

class BottomConteinerForm extends Component {
  render() {
    return [
      <div id='textarea-conteiner' key='textarea'>
        <div id='textarea-text' contentEditable onKeyUp={this.props.commentTextChange}></div>
      </div>,
      <div key='send_button' onClick={this.props.onNewMessage}>send</div>,
    ]
  }
}

export default class BottomConteiner extends Component {
  render() {
    return (
      <div className='bottom-conteiner'>
        <BottomConteinerForm onNewMessage={this.props.onNewMessage} commentTextChange={this.props.commentTextChange} />
      </div>
    )
  }
}