import React, { Component } from 'react';

class Avatar extends Component {
  render() {
    let name, classNme;
    if (this.props.manager) {
      name = "M";
      classNme = "avatar";
    } else {
      name = "U";
      classNme = "avatar-revers";
    }
    return (
      <div className={classNme}>
        <div>{name}</div>
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
      <div className={this.props.data.manager ? 'comment' : 'comment-revers'}>
        <Avatar manager={this.props.data.manager} />
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