import React from "react";
import "../css/Message.css";

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        content: props.content,
        username: props.username,
        date: props.date,
        };
    }

    render() {
        return (
        <div className="message-container">
            <div className="message-header">
            <span className="message-sender">{this.state.username}</span>
            <span className="message-time">{this.state.date}</span>
            </div>
            <div className="message-content">
            <p className="message-body">{this.state.content}</p>
            </div>
        </div>
        );
    }
}

export default Message;