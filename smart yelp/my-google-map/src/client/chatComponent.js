import React, { Component } from 'react';
import './chatComponent.css';

// var io = window.io;
// var socket = io('http://localhost:8080');

class ChatComponent extends Component {

	// componentDidMount() {
 //        socket.on('sendBackToClient', function(data) { //将消息输出到控制台
 //            console.log('rrrhey, in sendBackToClient ' + data);
 //        });
 //    }

	constructor(props) {
        super(props);
        this.state = { 
            chat: ''
        };
        // this.setState({ chat: this.state.chat + '<div> <p>' + this.props.chatin + '</p></div> '});
    }

	render() {
		if(this.props.clientName === this.props.chatData[0]) {
			return (
       			<p style={{textAlign: 'right'}}><span style={{fontWeight:800}}>{this.props.chatData[0]}</span>:  {this.props.chatData[1]}</p>  
			);
		} else {
			return (
       			<p style={{textAlign: 'left'}}><span style={{fontWeight:800}}>{this.props.chatData[0]}</span>:  {this.props.chatData[1]}</p>  
			);
		}
		
		
	}
	
}

export default ChatComponent;