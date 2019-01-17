import React from 'react';
import './button.css';

const ALIAS = {
    facebook: 'Facebook',
    sms: 'SMS',
    telegram: 'Telegram',
    viber: 'Viber',
    vk: 'Вконтакте'
};

const getMessengerURI = (type, data) => {
    switch (type) {
        case 'facebook':
            return `https://facebook.com/${data}`;
        case 'sms':
            return `tel:+${data}`;
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

            result.push({
                title: ALIAS[prop],
                name: prop,
                href: getMessengerURI(prop, messengers[prop])
            });
        }

        return <div>
            {result.map((item, i) => {
                return <a href={item.href} key={i} className="messenger-item">
                    <div className="messenger-title">{item.title}</div>
                    <div className="messenger-icon">
                        <img src={require(`./${item.name}.svg`)} />
                    </div>
                </a>
            })}
        </div>
    }
    render() {
        const { showButtons } = this.state;
        const { nav, color, lastState } = this.props;
        return <div className={(showButtons) ? 'list-visible' : ''}>

            <div className={'messenger-list'}>
                <div className="messenger-item" onClick={() => { nav('chat') }}>
                    <div className="messenger-title">Чат с оператором</div>
                    <div className="messenger-icon">
                        <div style={{ background: '#33d9b2' }} className="chat-icon">
                            <img src={require(`./chat.svg`)} />
                        </div>
                    </div>
                </div>
                <div className="messenger-item" onClick={() => { nav('callback') }}>
                    <div className="messenger-title">Обратный звонок</div>
                    <div className="messenger-icon">
                        <div style={{ background: '#227093' }} className="chat-icon">
                            <img src={require(`./call.svg`)} />
                        </div>
                    </div>
                </div>
                {this.renderMessengerLinks()}
            </div>
            <div className='qButton' onClick={this.onClickHandler.bind(this)}>
                <img className='pulse' style={{ background: color }} src={require('./qButton.svg')} />
            </div>
        </div>
    }
}