import axios from 'axios';
import Parser from 'html-react-parser';
import textVersion from 'textversionjs';
import DDP from 'ddp.js';

const getUrl = (processId, companyId, path) => {
  return `https://api.mixapp.io/webhooks/mixapp/${processId}/${companyId}/${path}`
}

export const config = {
  companyId: '',
  backApiProcessId: '5bc49dd0574e7403e22ec1a0',
  frontApiProcessId: '5bc49dd735b38203254872a5'
};

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-GB', {
    hour: "numeric",
    minute: "numeric"
  });
}

export const sentRequest = async (email, message) => {
  try {
    const uri = getUrl(config.backApiProcessId, config.companyId, 'requests');
    let result = await axios.post(uri,{
      email,
      message
    });
    return result.data.result;
  } catch (err) {
    throw err;
  }
};

export const sentCallbackRequest = async (phone) => {
  try {
    const uri = getUrl(config.backApiProcessId, config.companyId, 'callback');
    let result = await axios.post(uri,{
      phone
    });
    return result.data.result;
  } catch (err) {
    throw err;
  }
};

// Fetch widget settings by company
export const fetchSettings = async () => {
  try {
    const uri = getUrl(config.backApiProcessId, config.companyId, 'widget');
    let result = await axios.get(uri);
    return result.data.result;
  } catch (err) {
    throw err;
  }
};

export const groupsInfo = async (roomId, authToken, userId) => {
  try {

    let result = await axios.get('https://chat.mixapp.io/api/v1/groups.info', {
      params: {
        roomId: roomId
      },
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId
      }
    }
    );
    return result;

  } catch (err) {
    throw err;
  }
}

export const groupsMembers = async (roomId, authToken, userId) => {
  try {

    let result = await axios.get('https://chat.mixapp.io/api/v1/groups.members', {
      params: {
        roomId: roomId
      },
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId
      }
    }
    );
    return result;

  } catch (err) {
    throw err;
  }
}

export const groupsHistory = async (roomId, oldest, authToken, userId) => {
  try {

    let result = await axios.get('https://chat.mixapp.io/api/v1/groups.history', {
      params: {
        roomId: roomId,
        oldest: oldest
      },
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId
      }
    }
    );
    return result;

  } catch (err) {
    throw err;
  }
}

export const regClient = async () => {
  try {
    const uri = getUrl(config.frontApiProcessId, config.companyId, 'reg-client');
    let result = await axios.post(uri);
    return result;
  } catch (err) {
    throw err;
  }
}

export const startChat = async (userId, roomId) => {
  try {

    const uri = getUrl(config.frontApiProcessId, config.companyId, 'start-chat');
    let result = await axios.post(uri, {
      userId: userId,
      roomId: roomId
    });
    return result;
  } catch (err) {
    throw err;
  }
}

export const init = async function (newUser) {
  try {

    if (newUser) {
      let itemArray = [
        'mixapp.userId',
        'mixapp.roomId',
        'mixapp.token'
      ];
      for (let i = 0; i < itemArray.length; i++) {
        localStorage.removeItem(itemArray[i]);
      }
    }

    let userId = localStorage.getItem('mixapp.userId');
    let roomId = localStorage.getItem('mixapp.roomId');
    let token;
    if (userId && roomId) {
      let result = await startChat(userId, roomId);
      localStorage.setItem('mixapp.token', result.data.token);
      token = result.data.token;
    } else {
      let result = await regClient();
      localStorage.setItem('mixapp.userId', result.data.userId);
      userId = result.data.userId;
      localStorage.setItem('mixapp.roomId', result.data.roomId);
      roomId = result.data.roomId;
      result = await startChat(userId, roomId);
      localStorage.setItem('mixapp.token', result.data.token);
      token = result.data.token;
    }

    return {
      userId: userId,
      roomId: roomId,
      token: token
    };

  } catch (error) {
    console.error(error);
  }
}

var user_manager = '';
var user_client = '';

export const getMessage = async (message) => {
  try {

    let nickname, manager, avatar;

    if (message.u._id === user_client._id) {
      nickname = user_client.username;
      manager = false;
      avatar = 'https://pp.userapi.com/c846019/v846019379/363af/-93jUzr3Bas.jpg'
    } else {
      nickname = user_manager.username;
      manager = true;
      avatar = 'https://pp.userapi.com/c638825/v638825227/505db/HokgJ-HZ288.jpg'
    }

    return {
      avatar: avatar,
      nickname: nickname,
      text: Parser(message.msg.replace(/\n/g, '<br/>')),
      date: getCurrentTime(),
      manager: manager
    };

  } catch (err) {
    throw err;
  }
}

export const getMessages = async (roomId, oldest, authToken, userId) => {
  try {

    let comments = [];
    let result_ = await groupsMembers(roomId, authToken, userId);
    let result = await groupsHistory(roomId, oldest, authToken, userId);
    if (isManager(result_.data.members[0].username)) {
      user_manager = result_.data.members[0];
      user_client = result_.data.members[1];
    } else {
      user_manager = result_.data.members[1];
      user_client = result_.data.members[0];
    }
    result = result.data.messages.reverse();
    for (let i = 0; i < result.length; i++) {
      comments.push(await getMessage(result[i]));
    }

    return comments;

  } catch (err) {
    throw err;
  }
}

/* Chat api */

var commentText = '';
var commentReactObj = null;

export const sendComment = async () => {
  if (String(commentText) < 1) {
    return;
  }

  console.log(commentText);

  /* Отправка сообщение */
  if (false)
    return;

  commentText = '';
  document.getElementById('textarea-text').innerHTML = '';
}

export const getComment = async () => {
  return {
    commentText: this.commentText,
    commentReactObj: this.commentReactObj
  }
}

export const changeComment = async (event) => {
  commentText = textVersion(document.getElementById('textarea-conteiner').innerHTML);
  commentReactObj = Parser(document.getElementById('textarea-conteiner').innerHTML);

  if (event.key === 'Enter' && event.ctrlKey) {
    sendComment();
  }
}

export const isManager = async (nickname) => {
  try {

    return nickname.indexOf('client') === -1;

  } catch (err) {
    throw err;
  }
}

export const webSocket = async (self) => {
  try {

    // Stream API
    let authToken = localStorage.getItem('mixapp.token');
    let roomId = localStorage.getItem('mixapp.roomId');

    // socket connection
    const options = {
      endpoint: 'wss://chat.mixapp.io/websocket',
      SocketConstructor: WebSocket
    };
    const ddp = new DDP(options);

    ddp.on('connected', () => {
      console.log('Connected');
      ddp.method('login', [{ resume: authToken }]);
      ddp.sub('stream-room-messages', [roomId, false]);
    });

    ddp.on('changed', msg => {
      let args = msg.fields.args[0];
      let username = args.u.username;
      let is_Manager = isManager(username);
      let avatar;
      if (isManager(username)) {
        avatar = 'https://pp.userapi.com/c638825/v638825227/505db/HokgJ-HZ288.jpg';
      } else {
        avatar = 'https://pp.userapi.com/c846019/v846019379/363af/-93jUzr3Bas.jpg';
      }

      self.setState({
        comments: [...self.state.comments, {
          avatar: avatar,
          nickname: username,
          text: Parser(args.msg.replace(/\n/g, '<br/>')),
          date: getCurrentTime(),
          manager: is_Manager
        }]
      })
    })

  } catch (err) {
    throw err;
  }
}