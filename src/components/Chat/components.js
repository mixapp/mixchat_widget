import React, { Component } from 'react';

class Avatar extends Component {
  render() {
    return (
      <div className='avatar'>
        <img src={this.props.avatar} height='30' width='30' alt='comment avatar' />
      </div>
    )
  }
}

class CommentText extends Component {
  render() {
    return (
      <div className='comment-text'>
        <div>
          <div>{this.props.nickname}</div>
          <div>{this.props.date}</div>
        </div>
        <div className='text'>
          {this.props.text}
        </div>
      </div>
    )
  }
}

class Comment extends Component {
  render() {
    return (
      <div className='comment'>
        <Avatar avatar={this.props.data.avatar} />
        <CommentText
          nickname={this.props.data.nickname}
          text={this.props.data.text}
          date={this.props.data.date}
          manager={this.props.data.manager} />
      </div>
    )
  }
}

export default class Comments extends Component {
  render() {
    return (
      <div>
        {
          this.props.comments.map((value, key) => {
            value.key = key + new Date().getTime();
            return <Comment
              key={value.key.toString()}
              data={value} />
          })
        }
      </div >
    )
  }
}