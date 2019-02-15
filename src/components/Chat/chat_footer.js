import React, { Component } from 'react';
import Parser from 'html-react-parser';
import textVersion from 'textversionjs';
import './styles.css';
import * as Api from '../../api';

class BottomConteinerForm extends Component {
  state = {
    commentText: '',
    commentReactObj: ''
  }

  async sendComment() {
    if (String(this.state.commentText) < 1) {
      return;
    }

    // Stream API
    let authToken = localStorage.getItem('mixapp.token');
    let roomId = localStorage.getItem('mixapp.roomId');
    let userId = localStorage.getItem('mixapp.userId');

    let result = await Api.sendToRocketChat(roomId, authToken, userId, this.state.commentText);

    this.setState({
      commentText: ''
    });

    return result;
  }

  async changeComment(event) {

    let elemHTML = document.getElementById('textarea-conteiner').innerHTML;
    this.setState({
      commentText: textVersion(elemHTML),
      commentReactObj: Parser(elemHTML)
    });

    if (event.key === 'Enter' && !event.shiftKey) {
      document.getElementById('textarea-text').innerHTML = '';
      this.sendComment();
    }
  }

  render() {
    return [
      <div id='textarea-conteiner' key='textarea'>
        <div id='textarea-text' contentEditable onKeyUp={this.changeComment.bind(this)}></div>
      </div>,
      <div key='send_button' onClick={this.sendComment.bind(this)}>
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