import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './chatArea.css';
import ChatComponent from './chatComponent.js';
import { message, Button, Card, Input, Icon, Modal,notification } from 'antd';
import '../../node_modules/antd/dist/antd.css';


var io = window.io;
// var socket = io('http://localhost:8080');
var socket;

// const success = () => {
//   message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10);
// };

class ChatArea extends Component {

    componentDidMount() {
        console.log('inDIDMOUNT~~~~~~~');
        socket = this.props.socket;
        console.log(this.props.sessionId);
        console.log(this.props.chatData);
        // this.setState({chat: this.props.chatData});
        // console.log(this.props.chatData);
        this.scrollToBottom();
        this.scrollBottom();
        // socket.on('clientListening', this.handleWorldSocket);
    }

    componentDidUpdate() {
        // socket = this.props.socket;
        // this.setState({chat: this.props.chatData});
        // console.log(this.props.sessionId);
        // console.log('in did update');
        this.scrollToBottom();
        this.scrollBottom();
    }

    constructor(props) {
        console.log('hello, createArea constructor');
        super(props);
        this.state = { 
            moreChatRoomType: false,
            term: '',
            name: '',
            chat: [],
            loading: false,
            visible: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleName = this.handleName.bind(this);
        
        this.scrollToBottom = this.scrollToBottom.bind (this);
        this.scrollBottom = this.scrollBottom.bind (this);

    }

    showModal = (sessionId) => {
      socket.emit('followThisSession', sessionId);
      console.log('in show modal');
      this.setState({
        visible: true
      });
    }

    handleOk = () => {
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ loading: false, visible: false });
      }, 3000);
    }

    handleCancel = () => {
      this.setState({ visible: false });
    }

    openNotification = () => {
        const name = this.props.chatData[this.props.chatData.length-1][0];
        notification.config({
          duration: 2.5
        });
        notification.open({
          message: 'Wolrd Chat Room',
          description: name +':   ' + this.props.chatData[this.props.chatData.length-1][1],
          // icon: <span style={{fontWeight: 500 , fontSize: 15, width: 10}} >{name}</span>
        });
    };
     

    handleName(e) {
        //socket
        // console.log(this.state.name);
        e.preventDefault();
    }

    

    // handleWorldSocket(data) {
    //     console.log('hey, in backToAll ');
    //     console.log(data);
    //     let chatArray = data;
    //     this.setState({ chat: chatArray});
    //     this.state.chat = chatArray;
    //     // this.success();
    //     this.openNotification();
    // }

    handleSubmit(e) {
        this.setState({ term: ''});

        const authenticated = this.props.auth.authenticated();

        if(!authenticated) {
            this.state.name='Guest';
            this.setState({name: 'Guest'});
        } else {
            let n = JSON.parse(localStorage.getItem('profile')).nickname;
            this.state.name= n;
            this.setState({name: n});
        }

        let chatOBJ = {
            session: this.props.sessionId,
            name: this.state.name,
            text: this.state.term
        };

        console.log(chatOBJ);
        //socket
        socket.emit('sendUserInput', chatOBJ);
        e.preventDefault();
    }

    scrollToBottom() {
        // console.log(this.messagesEnd);
        const node = ReactDOM.findDOMNode(this.messagesEnd);
        if(node !== null) {
            node.scrollIntoView({ behavior: "smooth" });
        }
    }

    scrollBottom() {
        const endPoint = ReactDOM.findDOMNode(this.chatEnd);
        if(endPoint !== null) {
            endPoint.scrollIntoView({ behavior: "smooth" });    
        }
        
    }
   
    
    renderChat() {
        const x = this;

            const chat_list = this.props.chatData.map(function(chatNameTextArray, i) {
                return (
                    <ChatComponent key = {i} chatData={chatNameTextArray} clientName={x.state.name}/>
                );
            });
            return (
                <div>{chat_list}</div>
            );
    }

    render() {
        const { visible, loading } = this.state;
        const authenticated = this.props.auth.authenticated();
        console.log(authenticated);

        if(this.props.chatData && this.state.moreChatRoomType === false) {
            if(this.props.sessionId === 'world') {
                return (
                    <div style={{float:'right', margin: 1, width: 150}}>
                      <Button style={{position: 'fixed', zIndex: 120, bottom: 35, width: 150, background: '#e8334b', border: 'none'}} type="primary" onClick={()=>this.showModal(this.props.sessionId)}>
                        {this.props.sessionId}
                      </Button>
                      <Modal
                        visible={visible}
                        title= {this.props.name}
                        // style={{maxHeight: 300, overflowY: 'scroll'}}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <form key = "putname" style={{ width: `100%`, top: 0}} onSubmit = { this.handleName } >
                              <Input style={{ width: `100%` }}
                                    disabled= 'true'
                                    value = {authenticated? JSON.parse(localStorage.getItem('profile')).nickname: 'Guest'}
                                    placeholder = {authenticated? JSON.parse(localStorage.getItem('profile')).nickname: 'Guest'}
                                    onChange = {
                                        (e) => {
                                            this.setState({ name: e.target.value });
                                            // socket.emit('sendUserInput', e.target.value);
                                        }
                                    }
                                  addonAfter={
                                    <Icon type="rocket" />
                                  }
                              />
                            </form>,
                            <form key = "input" style={{ width: `100%` }} onSubmit = { this.handleSubmit } >
                                <Input style={{ width: `100%` }} 
                                    value = { this.state.term }
                                    placeholder = 'Sharing ideas ...'
                                    onChange = {
                                        (e) => {
                                            this.setState({ term: e.target.value });
                                            // socket.emit('sendUserInput', e.target.value);
                                        }
                                    }
                                /> 
                            </form>,
                          <Button key="back" size="large" onClick={this.handleCancel}>Exit</Button>,
                          <Button key="submit" type="primary" size="large" loading={loading} onClick={ this.handleSubmit }>
                            Submit
                          </Button>,
                        ]}
                      >
                      {this.renderChat()}
                      <div style={{ float:"left", clear: "both" }} ref={(c)=>{ this.chatEnd = c }} />
                      </Modal>
                    </div>
                );
            } else {
                return (
                        <div style={{float:'right', margin: 1, width: 150}}>
                          <Button style={{position: 'fixed', zIndex: 120, bottom: 0, float:'right', margin: 1, width: 150, overflow: 'hidden'}} type="primary" onClick={()=>this.showModal(this.props.sessionId)}>
                            {this.props.name}
                          </Button>
                          <Modal
                            visible={visible}
                            title= {this.props.name}
                            // style={{maxHeight: 300, overflowY: 'scroll'}}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <form key = "putname" style={{ width: `100%`, top: 0}} onSubmit = { this.handleName } >
                                  <Input style={{ width: `100%` }}
                                        disabled= 'true'
                                        value = {authenticated? JSON.parse(localStorage.getItem('profile')).nickname: 'Guest'}
                                        placeholder = {authenticated? JSON.parse(localStorage.getItem('profile')).nickname : 'Guest'}
                                        onChange = {
                                            (e) => {
                                                this.setState({ name: e.target.value });
                                                // socket.emit('sendUserInput', e.target.value);
                                            }
                                        }
                                      addonAfter={
                                        <Icon type="rocket" />
                                      }
                                  />
                                </form>,
                                <form key = "input" style={{ width: `100%` }} onSubmit = { this.handleSubmit } >
                                    <Input style={{ width: `100%` }} 
                                        value = { this.state.term }
                                        placeholder = 'Sharing ideas ...'
                                        onChange = {
                                            (e) => {
                                                this.setState({ term: e.target.value });
                                                // socket.emit('sendUserInput', e.target.value);
                                            }
                                        }
                                    /> 
                                </form>,
                              <Button key="back" size="large" onClick={this.handleCancel}>Exit</Button>,
                              <Button key="submit" type="primary" size="large" loading={loading} onClick={ this.handleSubmit }>
                                Submit
                              </Button>,
                            ]}
                          >
                          {this.renderChat()}
                          <div style={{ float:"left", clear: "both" }} ref={(c)=>{ this.chatEnd = c }} />
                          </Modal>
                        </div>
                );
            }
            

        } else if(this.props.chatData && this.state.moreChatRoomType === true) {
            return (
                    <div style={{position: 'fixed', zIndex: 100, bottom: 0, right: 0, width: 300, height: 500 }}>
                      <Card id = "textArea" title ="World Chat Room" style={{ width: 300, height: 400}}>
                        {this.renderChat()}
                        <div style={{ float:"left", clear: "both" }}
                               ref={(el) => { this.messagesEnd = el }} />
                      </Card>
                      
                      <Card style={{ width: 300 , height: 95}}>
                      <form style={{ width: `100%`, top: 0}} onSubmit = { this.handleName } >
                        <Input style={{ width: `100%` }}
                              value = { this.state.name }
                              placeholder = 'Type a name ...'
                              onChange = {
                                  (e) => {
                                      this.setState({ name: e.target.value });
                                      // socket.emit('sendUserInput', e.target.value);
                                  }
                              }
                            addonAfter={
                              <Icon type="rocket" />
                            }
                        />
                      </form>
                      <form style={{ width: `100%` }} onSubmit = { this.handleSubmit } >
                        
                          <Input style={{ width: `100%` }} 
                              value = { this.state.term }
                              placeholder = 'Sharing ideas ...'
                              onChange = {
                                  (e) => {
                                      this.setState({ term: e.target.value });
                                      // socket.emit('sendUserInput', e.target.value);
                                  }
                              }
                              addonAfter={
                              <Icon type="edit" />
                            }
                          /> 
                      </form>
                      </Card>
                    </div>
            );   
            
        } else {
            return (
                <div>loading...</div>
            );
        }
    }
}


export default ChatArea;

