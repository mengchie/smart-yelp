// app.use('/static', express.static(path.join(__dirname, '../react_test2/build/static/')));
// app.use(function(req, res) {
//     res.sendFile('index.html', { root: path.join(__dirname, '../react_test2/build') });
// });
var redisClient = require('./redisClient');
const express = require('express');
const app = express();
var path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.use('/static', express.static(path.join(__dirname, '../my-google-map/build/static/')));
app.use(function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../my-google-map/build') });
});

var sessionUserChat = {'world' : [[],[]]};
// var i = 0;
// {
//     'sesisonId' : [sessionUsersArray, sessionChatArray]
// }

// sessionChatArray = [name, text]
const TIMEOUT_IN_SECONDS = 3600;
var userFollow = {};

server.listen(8080);
console.log('Example app listening on port 8080!');


// internalClearWorldChat();
//socket部分
io.on('connection', function(socket) {
    //接收并处理客户端发送的foo事件
    // i++;
    // console.log(i);
    console.log('server-client connect!  ' + 'ID: ' + socket.id);
    addUserToUserFollow(socket.id);
    notifyClientsSuccess(socket.id);


    socket.on('sendUserInput', function(data) {
        //将消息输出到控制台
        console.log('hello, in sendUserInput ');

        if(data.session in sessionUserChat) {
            console.log('in server if');
            let key = data.session;
            addTextToSesssion(data);
            handleSessionUser(socket.id, key);
        } else {
            console.log('in server else');
            let newSession = data.session;
            console.log(newSession);
            let sessionUserArray = [];
            let sessionChatArray = [];
            // sessionUserArray.push(socket.id);
            sessionUserChat[newSession] = [];
            sessionUserChat[newSession].push(sessionUserArray);
            sessionUserChat[newSession].push(sessionChatArray);
            console.log(sessionUserChat);
            addTextToSesssion(data);
            handleSessionUser(socket.id, data.session);
        }
    });

    socket.on('sendUserId', function(data) {
        //将消息输出到控制台
        console.log('hello, userID: ' + data);
    });

    socket.on('followThisSession', function(sessionId) {
        console.log('in follow server');
        addSessionToUserFollow(sessionId, socket.id);
        let sessions = userFollow[socket.id];
        let sessionsData = {};
        console.log(sessions);
        sessions.map(function(session) {
            if(session in sessionUserChat) {
                sessionsData[session] = sessionUserChat[session][1];    
            } else {
                redisClient.get(session, function(data) {
                    if(data) {
                        console.log('session terminated previously, pulling back...');
                        // data[0].push(socket.id);
                        sessionsData[session] = data;
                        sessionUserChat[session] = [];
                        let userarray = [];
                        userarray.push(socket.id);
                        sessionUserChat[session].push(userarray);
                        sessionUserChat[session].push(data.split(","));
                    } else {
                        console.log('Nobody did this before, creating new session');
                        let newSession = session;
                        let sessionUserArray = [];
                        sessionUserArray.push(socket.id);
                        let sessionChatArray = [];
                        sessionUserChat[newSession] = [];
                        sessionUserChat[newSession].push(sessionUserArray);
                        sessionUserChat[newSession].push(sessionChatArray);
                        sessionsData[newSession] = []; 
                    }
                    
                    io.to(socket.id).emit('initSessions', sessionsData); 
                    console.log("sessionData" + JSON.stringify(sessionsData));
                });
                 
            }
        });
        // setTimeout(function(){ 
        //     console.log("sessionData" + JSON.stringify(sessionsData));
        //     io.to(socket.id).emit('initSessions', sessionsData); 

        // }, 1000);
        
        

        // io.to(socket.id).emit('initSessions', sessionsData);
    }); 

    // socket.on('disconnect', function() {
    //     // console.log();
        
    //     let sessions = userFollow[socket.id];
    //     sessions.map(function(session) {
    //         let index = sessionUserChat[session][0].indexOf(socket.id);
    //         if (index > -1) {
    //             sessionUserChat[session][0].splice(index, 1);
    //         }
    //         if(sessionUserChat[session][0].length === 0) {
    //             redisClient.set(session, sessionUserChat[session][1].toString(), redisClient.redisPrint);
    //             redisClient.expire(session, TIMEOUT_IN_SECONDS);
    //             delete sessionUserChat[session];
    //         }
    //     });

    //     delete userFollow[socket.id];
    // });


});

// function internalClearWorldChat() {
//     worldChat = [];
//     worldUser = [];
//     console.log(worldChat);
//     setTimeout(internalClearWorldChat, 30*60*1000);
// }

function addUserToUserFollow(id) {
    userFollow[id] = [];
}

function addSessionToUserFollow(sessionId, socketId) {
    console.log('in add session user');
    if(userFollow[socketId].indexOf(sessionId) <= -1) {
        userFollow[socketId].push(sessionId);
    }
    
}

function notifyClientsSuccess(id) { //emit world chat array back
    if(sessionUserChat['world']) {
        let worldChat = sessionUserChat['world'][1];
        console.log(worldChat);
        let worldChatSession = [];
        worldChatSession.push(['world']); // index 0 is session
        worldChatSession.push(worldChat); // index 1 is chat ...
        io.to(id).emit('successConnection', worldChatSession);
    }
}

function addTextToSesssion(data) {
    let key = data.session;
    let nameText = [];
    nameText.push(data.name);
    nameText.push(data.text);

    sessionUserChat[key][1].push(nameText);
    console.log(sessionUserChat[key]);
}

function handleSessionUser(socketId, key) { //emit array back
    let sessionUser = sessionUserChat[key][0];
    if(sessionUser.indexOf(socketId) == -1) {
        sessionUser.push(socketId);
    }
    console.log('sessionuser: ' + sessionUser);
    let sessionChatDataWithSession = [];
    sessionChatDataWithSession.push(key); //session is at index 0, chatArray is at index 1
    sessionChatDataWithSession.push(sessionUserChat[key][1]);
    console.log(sessionChatDataWithSession);
    for(let i = 0; i < sessionUser.length; i++) {
        io.to(sessionUser[i]).emit('backToAll', sessionChatDataWithSession);
    }
}


