import axios from 'axios';
import Parser from 'html-react-parser';
import DDP from 'ddp.js';

const getUrl = (processId, companyId, path) => {
  return `https://api.mixapp.io/webhooks/mixapp/${processId}/${companyId}/${path}`
}

export const config = {
  companyId: '',
  backApiProcessId: '5bc49dd0574e7403e22ec1a0',
  frontApiProcessId: '5bc49dd735b38203254872a5'
};

function getCurrentTime(date) {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: "numeric",
    minute: "numeric"
  });
}

export const sentRequest = async (email, message) => {
  try {
    const uri = getUrl(config.backApiProcessId, config.companyId, 'requests');
    let result = await axios.post(uri, {
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
    let result = await axios.post(uri, {
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
    let token, result;
    if (userId && roomId) {
      result = await startChat(userId, roomId);
      localStorage.setItem('mixapp.token', result.data.token);
      token = result.data.token;
    } else {
      result = await regClient();
      localStorage.setItem('mixapp.userId', result.data.userId);
      userId = result.data.userId;
      localStorage.setItem('mixapp.roomId', result.data.roomId);
      roomId = result.data.roomId;
      result = await startChat(userId, roomId);
      localStorage.setItem('mixapp.token', result.data.token);
      token = result.data.token;
    }

    return {
      msg: result.data.msg,
      userId: userId,
      roomId: roomId,
      token: token
    };

  } catch (error) {
    console.error(error);
  }
}


/* Functions */

async function getMessage(message, user_manager, user_client) {
  try {
    let clientId = localStorage.getItem('mixapp.userId');
    return {
      nickname: message.u.username,
      text: Parser(message.msg.replace(/\n/g, '<br/>')),
      date: getCurrentTime(message.ts),
      manager: message.u._id !== clientId
    };

  } catch (err) {
    throw err;
  }
}

export const isClient = async (member) => {
  try {
    let clientId = localStorage.getItem('mixapp.userId');
    return member._id === clientId;
  } catch (err) {
    throw err;
  }
}

export const getMessages = async (roomId, oldest, authToken, userId) => {
  try {

    let comments = [];
    let result = await groupsHistory(roomId, oldest, authToken, userId);
    result = result.data.messages.reverse();
    for (let i = 0; i < result.length; i++) {
      comments.push(await getMessage(result[i]));
    }

    return comments;

  } catch (err) {
    throw err;
  }
}

export const sendToRocketChat = async (roomId, authToken, userId, text) => {
  try {

    let result = await axios({
      method: 'POST',
      url: 'https://chat.mixapp.io/api/v1/chat.postMessage',
      data: {
        roomId: roomId,
        text: text
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken,
        'X-User-Id': userId
      }
    });
    return result;

  } catch (err) {
    throw err;
  }
}

export const webSocket = async (cb) => {
  try {

    let clientId = localStorage.getItem('mixapp.userId');
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
      ddp.method('login', [{ resume: authToken }]);
      ddp.sub('stream-room-messages', [roomId, false]);
    });

    ddp.on('changed', async (msg) => {
      try {
        let args = msg.fields.args[0];
        let username = args.u.username;

        cb(username, args, args.u._id !== clientId);

      } catch (err) {
        throw err;
      }
    })

  } catch (err) {
    throw err;
  }
}