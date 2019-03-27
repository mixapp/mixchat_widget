import axios from 'axios';
import Parser from 'html-react-parser';
import DDP from 'ddp.js';

const getUrl = (processId, companyId, path) => {
  return `https://api.mixapp.io/webhooks/mixapp/${processId}/${companyId}/${path}`
}

const getRocketChatURL = () => {
  return config.rocketChatHost;
}

export var config = {
  companyId: '',
  processId: '5c890db9574e7435772c4773'
};

export function getConfig() {
  return Object.assign({}, config);
}

export function setConfig(params) {
  config = Object.assign(config, params);
  return config;
}

function getCurrentTime(date) {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: "numeric",
    minute: "numeric"
  });
}

export const sentCallbackRequest = async (phone) => {
  try {
    const uri = getUrl(config.processId, config.companyId, 'callback');
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
    const uri = getUrl(config.processId, config.companyId, 'widget');
    let result = await axios.get(uri);
    return result.data.result;
  } catch (err) {
    throw err;
  }
};

export const groupsInfo = async (roomId, authToken, userId) => {
  try {

    let result = await axios.get(`https://${getRocketChatURL()}/api/v1/groups.info`, {
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

    let result = await axios.get(`https://${getRocketChatURL()}/api/v1/groups.members`, {
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
    return err;
  }
}

/* move to the sockets */
export const groupsHistory = async (roomId, oldest, authToken, userId) => {
  try {

    let result = await axios.get(`https://${getRocketChatURL()}/api/v1/groups.history`, {
      params: {
        roomId: roomId,
        oldest: oldest
      },
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId
      }
    });
    let { messages } = result.data;
    let messages_ = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].t === undefined) {
        messages_.push(messages[i]);
      }
    }
    result.data.messages = messages_;
    return result;

  } catch (err) {
    throw err;
  }
}

export const regClient = async () => {
  try {
    const uri = getUrl(config.processId, config.companyId, 'reg-client');
    let result = await axios.post(uri);
    return result;
  } catch (err) {
    throw err;
  }
}

export const startChat = async (userId, roomId) => {
  try {
    const uri = getUrl(config.processId, config.companyId, 'start-chat');
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
    return error;
  }
}


/* Functions */

async function getMessage(message, user_manager, user_client) {
  try {
    let clientId = localStorage.getItem('mixapp.userId');
    return {
      nickname: message.u._id === clientId ? 'Вы' : message.u.username,
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

var DDP_;
export const createSocket = async (cb = () => { }) => {
  // Stream API
  let authToken = localStorage.getItem('mixapp.token');
  let roomId = localStorage.getItem('mixapp.roomId');

  // socket connection
  const options = {
    endpoint: `wss://${getRocketChatURL()}/websocket`,
    SocketConstructor: WebSocket
  };
  const ddp = new DDP(options);

  ddp.on('connected', () => {
    ddp.method('login', [{ resume: authToken }]);
    ddp.sub('stream-room-messages', [roomId, false]);
  });

  let clientId = localStorage.getItem('mixapp.userId');
  ddp.on('changed', async (msg) => {
    try {
      let args = msg.fields.args[0];
      let username = args.u.username;

      cb(username, args, args.u._id !== clientId);

    } catch (err) {
      throw err;
    }
  })
  DDP_ = ddp;
  return ddp;
}

export const sendToRocketChatWebSocket = async (roomId, text) => {
  try {
    return DDP_.method('sendMessage', [{
      rid: roomId,
      msg: text
    }]);

  } catch (err) {
    throw err;
  }
}

export const isMobile = () => {
  var check = false;
  // eslint-disable-next-line
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

export const callWebhook = (event_type, params) => {
  return axios({
    method: 'POST',
    url: config.eventWebhook,
    data: {
      event_type: event_type,
      ...config,
      ...params
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
}