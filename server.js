// const hostname = '127.0.0.1';
// const port = 8082;
// const http = require('http');
// const server = http.createServer(function (req, res) {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World!\n');
// });
// server.listen(port, hostname, function () {
//   console.log('Server running at http://%s:%s/', hostname, port);
// });

// const WebSocketServer = require('node-qwebsocket');
// const socketServer = new WebSocketServer(server);
// socketServer.on('connection', function (socket) {
//   console.log('socket connected!');
  
//   socket.emit('message', { message: 'Hello Client!' });

//   socket.on('message', function (data) {
//     console.log('received raw message: %s', JSON.stringify(data, null, 2));
//     console.log(data);
//   });

//   socket.on('sendCommand', function () {
//     console.log('socket command...');

//   });
//   socket.on('close', function () {
//     console.log('socket closed...');
//   });
// });



var WebSocketServer = require("ws").Server;
var port = 8082;
var wss = new WebSocketServer({ port: port },()=>{
  console.log(`${port} is run`);
});




// Connection
wss.on("connection", function(ws) {
  console.log(`Socket on ${port}`);
  var emit = (data) => {
    console.log(data,'sendData');

    const SEND_FORMAT = {"DOF-RES": []};
    SEND_FORMAT['DOF-RES'].push(data);
    ws.send(JSON.stringify(SEND_FORMAT))
  };

  var parseMessage =(message)=>{
    return message['DOF-REQ'][0]['code']
  }
  emit( {"code": ["0000", true] });

  ws.on("message", function(message) {
    console.log("Received:");
    console.log(message);
    message = JSON.parse(message);
    let receive = parseMessage(message);
    let keyName;
    let value;
    // const [keyName,value] = [receive[0],receive[1]];

    if(Array.isArray(receive[0])){
      receive.map((list,idx)=>{
        let resData = 0
        keyName = list[0];
        if(keyName === '0006'){
          resData = 4
        }
        if(keyName === '0008'){
          resData = 0
        }
        message['DOF-REQ'][0]['code'][idx].push(resData)
      });
      emit({"code": parseMessage(message)})

    }else{
      keyName = receive[0]
      switch(keyName){
        case "0008" :{
          emit({"code": [["0008",0]]})
          break;
        }
        case "0006":{
          if(typeof value === 'number' ){
            emit({"code": [["0006",true]]})
          }else{
            emit({"code": [["0006"]]})
          }
          break;
        }
        case "0403":{
          emit({"code": [["0403",true]]})
          break;
        }
        default:{
          emit({"code": parseMessage(message)})
        }
      }
    }




    
  });

});



// if(key === 'DOF_0011'){
//   emit( {"code": ["0400", true, "123e4567-e89b-12d3-a456-426655440000"] })
// }
// if(key === 'DOF_0000'){
//   setTimeout(() => {
//     // emit({"DOF_0100":[1,true]})
//   }, 5000);
// }
