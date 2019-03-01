import React, { Component } from 'react';
import Wrapper from '../Wrapper/index';
import Loader from '../Loader/index';
import Parser from 'html-react-parser';
import * as Api from '../../api';
import Comments from './components';
import BottomConteiner from './chat_footer';
import './styles.css';

export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.chatBody = React.createRef();
  }

  state = {
    isLoading: true,
    comments: []
  }

  async componentDidMount() {
    const { nav } = this.props;
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

    /* Проверяем userId и roomId из cookies*/
    //let result = await Api.init();

    /* Если token не вернули, создаём нового юзера и получаем новый token */
    //if (!result.token) result = await Api.init(true);

    /* Проверяем наличие менеджера в чате */
    //let groupsMembers = await Api.groupsMembers(result.roomId, result.token, result.userId);

    if (groupsMembers.data.members.length < 2 || result.msg.error || result.msg.offline) {
      // Если операторов нет, переходим на страницу заявки 
      return nav('request');
    }

    /* Получаем комменты */
    let comments = await Api.getMessages(result.roomId, null, result.token, result.userId);
    this.setState({
      comments: comments
    });

    function getCurrentTime() {
      return new Date().toLocaleTimeString('en-GB', {
        hour: "numeric",
        minute: "numeric"
      });
    }

    async function addComment(username, args, is_Manager) {
      try {

        this.setState({
          comments: [...this.state.comments, {
            nickname: is_Manager ? username : "Вы",
            text: Parser(args.msg.replace(/\n/g, '<br/>')),
            date: getCurrentTime(),
            manager: is_Manager
          }]
        })

      } catch (err) {
        throw err;
      }
    }

    await Api.webSocket(addComment.bind(this));

    this.setState({
      isLoading: false
    });
  }

  async componentDidUpdate() {
    var e = document.querySelector('.chat-body');
    if (e) {
      e.scrollTop = 9999;
    }
  }

  render() {
    const { nav, color } = this.props;
    const { isLoading } = this.state;
    return <Wrapper nav={nav} color={color} title="Чат с оператором">
      {isLoading ? (<Loader color={color} />) : (<div className="chat">
        <div ref={this.chatBody} className="chat-body">
          <Comments comments={this.state.comments} />
        </div>
        <div className="chat-footer">
          <BottomConteiner chatBody={this.chatBody} />
        </div>
      </div>)}
    </Wrapper>
  }
}