import React, { Component } from 'react';
import Parser from 'html-react-parser';
import textVersion from 'textversionjs';
import './styles.css';
import SendButtonSvg from '../Button/send_button_svg';
import * as Api from '../../api';

class BottomConteinerForm extends Component {
  state = {
    commentText: '',
    commentReactObj: '',
    mobile: false
  }

  async sendComment() {
    if (String(this.state.commentText).length < 1) {
      return;
    }

    setTimeout(() => {
      document.getElementById('textarea-text').innerHTML = '';
    }, 0);

    // Stream API
    let roomId = localStorage.getItem('mixapp.roomId');

    let result = await Api.sendToRocketChatWebSocket(roomId, this.state.commentText);
    if (result > 0) {
      this.setState({
        commentText: ''
      });
    }
  }

  windowResize = () => {
    let chatBody = this.props.chatBody.current;
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResize.bind(this));
    this.setState({
      mobile: Api.isMobile()
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResize.bind(this))
  }

  async changeComment(event) {

    let elemHTML = document.getElementById('textarea-text').innerHTML;
    this.setState({
      commentText: textVersion(elemHTML),
      commentReactObj: Parser(elemHTML)
    });

    if (event.key === 'Enter' && !event.shiftKey && !this.state.mobile) {
      this.sendComment();
    }
  }

  render() {
    return [
      <div key='textarea-text' id='textarea-text' data-placeholder='Введите сообщение…' contentEditable onKeyUp={this.changeComment.bind(this)}></div>,
      <div key='send_button' onClick={this.sendComment.bind(this)}>
        <SendButtonSvg />
      </div>
    ]
  }
}

export default class BottomConteiner extends Component {
  render() {
    return (
      <div className='bottom-conteiner'>
        <BottomConteinerForm chatBody={this.props.chatBody} />
      </div>
    )
  }
}