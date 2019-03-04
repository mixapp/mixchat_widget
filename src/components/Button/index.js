import React from 'react';
import CallSVG from './call_svg';
import ChatSVG from './chat_svg';
import FacebookSVG from './facebook_svg';
import SmsSVG from './sms_svg';
import TelegramSVG from './telegram_svg';
import VKSVG from './vk_svg';
import ViberSVG from './viber_svg';
import Qbutton from './qButton_svg';
import * as Api from '../../api';
import './button.css';

const ALIAS = {
  facebook: 'Facebook',
  sms: 'SMS',
  telegram: 'Telegram',
  viber: 'Viber',
  vk: 'Вконтакте'
};

const SVG = {
  facebook: <FacebookSVG />,
  sms: <SmsSVG />,
  telegram: <TelegramSVG />,
  vk: <VKSVG />,
  viber: <ViberSVG />
}

const isMobile = Api.isMobile();
const getRURI = (companyId, URL) => {
  return 'https://api.mixapp.io/webhooks/mixapp/5bc49dd0574e7403e22ec1a0/' + companyId + '/stats?url=' + URL
}

const getMessengerURI = (type, data) => {
  switch (type) {
    case 'facebook':
      return `https://facebook.com/${data}`;
    case 'sms':
      return isMobile ? `sms:+${data}` : null;
    case 'telegram':
      return `tg://resolve?domain=${data}`;
    case 'viber':
      return `viber://pa?chatURI=${data}`;
    case 'vk':
      return `https://vk.com/${data}`;
    default:
      return '';
  }
};

export default class Button extends React.Component {
  state = {
    showButtons: false,
  }
  onClickHandler() {
    const { showButtons } = this.state;
    const { openChat } = this.props;
    if (openChat) {
      this.props.nav('chat');
      return;
    }
    this.setState({
      showButtons: !showButtons
    });
  }
  renderMessengerLinks() {
    const { messengers } = this.props;
    let result = [];

    for (let prop in messengers) {
      if (!messengers[prop]) {
        continue;
      }


      if (isMobile || (!isMobile && ALIAS[prop] !== 'SMS')) {
        result.push({
          title: ALIAS[prop],
          name: prop,
          href: getRURI(Api.getConfig().companyId, getMessengerURI(prop, messengers[prop]))
        });
      }
    }

    return <div>
      {result.map((item, i) => {
        return <a href={item.href} key={i} className="messenger-item" target="_blank" rel="noopener noreferrer" s>
          <div className="messenger-title">{item.title}</div>
          <div className="messenger-icon">
            {SVG[item.name]}
            {/* <img src={require(`./${item.name}.svg`)} /> */}
          </div>
        </a>
      })}
    </div>
  }
  render() {
    const { showButtons } = this.state;
    const { nav, color } = this.props;
    return <div className={(showButtons) ? 'list-visible' : ''}>

      <div className={'messenger-list'}>
        <div className="messenger-item" onClick={() => { nav('chat') }}>
          <div className="messenger-title">Чат с оператором</div>
          <div className="messenger-icon">
            <div style={{ background: '#33d9b2' }} className="chat-icon">
              <ChatSVG />
            </div>
          </div>
        </div>
        <div className="messenger-item" onClick={() => { nav('callback') }}>
          <div className="messenger-title">Обратный звонок</div>
          <div className="messenger-icon">
            <div style={{ background: '#227093' }} className="chat-icon">
              <CallSVG />
            </div>
          </div>
        </div>
        {this.renderMessengerLinks()}
      </div>
      <div className='qButton' onClick={this.onClickHandler.bind(this)}>
        <div className='pulse' style={{ background: color }}>
          <Qbutton className='pulse' />
        </div>
        {/* <img className='pulse' style={{ background: color }} src={require('./qButton.svg')} /> */}
      </div>
    </div>
  }
}