import axios from 'axios';

const getUrl = (processId, companyId, path) => {
  return `https://api.mixapp.io/webhooks/mixapp/${processId}/${companyId}/${path}`
}

export const config = {
  companyId: '',
  backApiProcessId: '5bc49dd0574e7403e22ec1a0',
  frontApiProcessId: '5bc49dd735b38203254872a5'
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