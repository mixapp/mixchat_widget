import React, { Component } from 'react';
import Wrapper from '../Wrapper/index';
import Loader from '../Loader/index';
import Parser from 'html-react-parser';
import * as Api from '../../api';
import Comments from './components';
import BottomConteiner from './chat_footer';
import './styles.css';

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-GB', {
    hour: "numeric",
    minute: "numeric"
  });
}

export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.chatBody = React.createRef();
  }

  state = {
    isLoading: true,
    comments: []
  }

  addComment(username, args, is_Manager) {
    try {
      if (args.t === undefined) {
        this.setState({
          comments: [...this.state.comments, {
            nickname: is_Manager ? username : "Вы",
            text: Parser(args.msg.replace(/\n/g, '<br/>')),
            date: getCurrentTime(),
            manager: is_Manager
          }]
        })

        if (this.state.comments.length === 1) {
          Api.callWebhook('jivo_onMessageSent');
        }
      }

    } catch (err) {
      throw err;
    }
  }

  async componentDidMount() {
    const { nav, greeting } = this.props;
    let result;
    let userId = localStorage.getItem('mixapp.userId');
    let roomId = localStorage.getItem('mixapp.roomId');
    let token = localStorage.getItem('mixapp.token');

    let groupsMembers = await Api.groupsMembers(roomId, token, userId);
    if (!groupsMembers.data) {
      result = await Api.init(true);
      groupsMembers = await Api.groupsMembers(result.roomId, result.token, result.userId);
    } else {
      result = await Api.init();
    }

    if (groupsMembers.data.members.length < 2 || result.msg.error || result.msg.offline) {
      // Если операторов нет, переходим на страницу заявки 
      return nav('request');
    }

    /* Получаем комменты */
    let comments = await Api.getMessages(result.roomId, null, result.token, result.userId);
    this.setState({
      comments: comments
    });

    await Api.createSocket(this.addComment.bind(this));

    this.setState({
      isLoading: false
    });
    Api.callWebhook('jivo_onOpen', { naem: 'web', title: 'Чат с оператором' });
    if (greeting && this.state.comments.length < 1) {
      this.addComment(this.props.companyName, { msg: `<div>${greeting}</div>` }, true);
    }
  }

  async componentDidUpdate() {
    var e = document.querySelector('.chat-body');
    if (e) {
      e.scrollTop = 9999;
    }
  }

  render() {
    const { nav, color } = this.props;
    const { isLoading, comments } = this.state;
    return <Wrapper nav={nav} color={color} title="Чат с оператором">
      {isLoading ? (<Loader color={color} />) : (<div className="chat">
        <div ref={this.chatBody} className="chat-body">
          <Comments comments={comments} />
        </div>
        <div className="chat-footer">
          <BottomConteiner chatBody={this.chatBody} />
        </div>
      </div>)}
    </Wrapper>
  }
}