import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './client/searchBar.js';
import ChatArea from './client/chatArea.js';
import CardArea from './client/cardArea.js';
import Gmap from './client/gmap.js';
import {Row, Col, code, Grid} from 'react-bootstrap';
import { message, Button } from 'antd';
import Auth from './Auth0.js';

let auth = new Auth();
var io = window.io;
var socket = io('http://localhost:8080');
// var socket = '';

// const worldObj = {
// 	'world' : []
// };

class App extends Component {

  componentDidMount() {

      console.log('inDIDMOUNT');
      // socket = this.props.socket;
      
      // this.setState({allChatData: worldObj});

      socket.on('backToAll', this.handleBackToAllSocket);
      socket.on('successConnection', this.handleSuccessConnection);
      socket.on('initSessions', this.handleInitSessions);
      // socket.on('clientListening', this.handleWorldSocket);
  }

  constructor(props) {
      super(props);
      this.state = { 
          sessions: [],
          allChatData: {}, //allchatdata = {'session' : [chatdata]}
          worldChat: [],
          sessionNames: {},
          markers:[],
          targetMarker: {},
          cancelMarker:{},
          notification:{}
      };
      this.setSessionsInApp = this.setSessionsInApp.bind(this);
      this.handleSuccessConnection = this.handleSuccessConnection.bind(this);
      this.handleBackToAllSocket = this.handleBackToAllSocket.bind(this);
      this.setGraphMarkers = this.setGraphMarkers.bind(this);
      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.handleInitSessions = this.handleInitSessions.bind(this);
      this.success = this.success.bind(this);

  }
  // session, who, message
  success() {
  	let obj = this.state.notification;
  	message.success('From ' + obj.session + '  ' + obj.who + ': ' + obj.message, 3);
  	  	// message.success('From ' , 3);

  }

  handleMouseEnter(sessionMarker) {
  	console.log(sessionMarker);
  	console.log(' over');
  	this.setState({targetMarker : sessionMarker});
  }

  handleMouseLeave(sessionMarker) {	
  	console.log(sessionMarker + ' out');
  	this.setState({cancelMarker : sessionMarker});
  }

  handleInitSessions(sessionsData) {
  	let allChat = this.state.allChatData;
  	allChat = sessionsData;
  	this.setState({allChatData: allChat});
  	this.state.allChatData = allChat;
  	console.log('handleInit');
  	console.log(this.state.allChatData);
  }

  handleSuccessConnection(worldData) {
      console.log('Successfully Connect!!');
      this.setState({ worldChat: worldData[1]});
      this.state.worldChat = worldData[1];
  }

  handleBackToAllSocket(data) {
  	let obj = {};
      console.log('in backToAllsocket!');
      console.log(data);
      if(data[0] === 'world') {
      	this.setState({ worldChat: data[1]});
      	this.state.worldChat = data[1];
      	obj = {
      		session : 'world',
      		who : data[1][data[1].length-1][0],
      		message : data[1][data[1].length-1][1]
      	};
      } else {
      	let allChat = this.state.allChatData; //obj
      	allChat[data[0]] = data[1];
      	this.setState({allChatData: allChat});
      	obj = {
      		session : this.state.sessionNames[data[0]],
      		who : data[1][data[1].length-1][0],
      		message : data[1][data[1].length-1][1]
      	};
      }
      this.setState({notification: obj});
      this.success();
      // this.success(this.state.sessionNames[data[0]], data[1][data[1].length-1][0], data[1][data[1].length-1][1]);
      // this.openNotification();
  }

  setGraphMarkers(markers) {
  	this.setState({
  		markers: markers
  	});
  	console.log(this.state.markers);
  }


  setSessionsInApp() {
  	let x = this;
  	console.log('in set session app');
  	console.log(this._map.state.sessions);
  	let sess = this._map.state.sessions;
  	let sessN = this._map.state.sessNames;

  	sess.map(function(ses, i) {
  		if(!(ses in x.state.allChatData)) {
  			let allChat = x.state.allChatData; //obj
      		allChat[ses] = [];
      		x.setState({allChatData: allChat});
      		console.log(x.state.allChatData);
  		}
  	});
  	
  	this.setState({
  		sessions: sess,
  		sessionNames: sessN
  	});
  }

  renderChat() {
  	if(this.state.sessions.length !== 0) {
  		let x = this;
      	const chat_areas = this.state.sessions.map(function(sessionId, i) {
      	    return (
      	        <ChatArea key = {i} auth={auth} sessionId={sessionId} socket= {socket} name= {x.state.sessionNames[sessionId]} chatData= {x.state.allChatData[sessionId]}/>
      	    );
      	});
      	// console.log(chat_list);
      	return (
      	    <div style={{position: 'fixed', right:90}}>{chat_areas}</div>
      	);
  	}
  	
  }

  render() {
  	console.log('in app render');
  	// console.log(this.state.allChatData['world']);
    return (
      <div className="App">
        <SearchBar auth= {auth} ref={(bar) => { this._bar = bar; }} />
        <Grid>
        <Row className="show-grid">
    	  <Col xs={12} sm={6} md={6} style={{position: 'fixed', zIndex: 0, top: 70, left: 0}}><Gmap auth={auth} targetMarker={this.state.targetMarker} cancelMarker={this.state.cancelMarker} setSession={this.setSessionsInApp} sessions={this.state.sessions} setMarkersInApp={this.setGraphMarkers} ref={(map) => { this._map = map; }}/></Col>
    	  <Col className="cardss" xs={12} sm={6} md={6} style={{position: 'absolute',zIndex: -2, top:70, right: 0}}><CardArea markers = {this.state.markers} handleMouseLeave= {this.handleMouseLeave} handleMouseEnter= {this.handleMouseEnter} ref={(card) => { this._card = card; }}/></Col>
    	</Row> 
    	</Grid>
    	<div style={{position: 'fixed', right:90}}>
    		<ChatArea style={{position: 'fixed'}} auth={auth} sessionId='world' name='world' socket= {socket} chatData={this.state.worldChat} />
    	</div>
    	{this.renderChat()}
      </div>
    );
  }
}

export default App;
