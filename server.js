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


const uuid4 = require('uuid/v4')
var WebSocketServer = require("ws").Server;
var port = 8082;
var wss = new WebSocketServer({ port: port },()=>{
  console.log(`${port} is run`);
});




// Connection
wss.on("connection", function(ws) {
  console.log(`Socket on ${port}`);
  var emit = (data) => {
    console.log('Server Send : ', data);

    const SEND_FORMAT = {"DOF-RES": []};
    SEND_FORMAT['DOF-RES'].push(data);
    try{
      ws.send(JSON.stringify(SEND_FORMAT))
    }catch(e){
      console.log(e.message);
    }
  };
  
  
  var parseMessage =(message)=>{
    console.log('\x1b[31m%s\x1b[0m', 'Received Message'); 
    if(message['DOF-REQ']){
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(message));
      return message['DOF-REQ'][0]['code']
    }else{
      console.log('\x1b[33m%s\x1b[0m', JSON.stringify(message)); 
      return message['DOF-RES'][0]['code']
    }
  }

  emit( {"code": [["0000", true]] });

  // setTimeout(() => {
  //   emit( {"code": [["0007", 1]] });
  // }, 1000);
  // setTimeout(() => {
  //   emit( {"code": [["0007", 0]] });
  // }, 2000);

  ws.on("message", function(message) {
    message = JSON.parse(message);
    let receive = parseMessage(message);
    let keyName;
    let value;
    // const [keyName,value] = [receive[0],receive[1]];
    // receive.push(['0007',true])
    if(receive.length >1 ){
      console.log('다중');
      receive.map((list,idx)=>{
        let responseMessage = message['DOF-REQ'][0]['code'][idx];
        let resData = 0
        keyName = list[0];
        if(list[1] === undefined){
          //여러개 보냈는데 이름만 확인할때
          if(keyName === '0006'){
            resData = 4
          }
          if(keyName === '0008'){
            resData = 0
          }
          responseMessage.push(resData);
        }

        switch(keyName){

          default:{

          }
        }
      });

      emit({"code": parseMessage(message)})

    }else{
      console.log('하나');
      keyName = receive[0][0];
      console.log(keyName,'keyName ');
      switch(keyName){
        case "0008" :{
          console.log('inin');
          emit({"code": [["0008",true]]});
          break;
        }
        case "0006":{
          // window
          if(typeof value === 'number' ){
            emit({"code": [["0006",true]]})
          }else{
            emit({"code": [["0006",true]]})
          }
          break;
        }
        case "0403":{
          // exit
          emit({"code": [["0403",true]]});
          break;
        }
        case "0402":{
          // setting
          emit({"code": [["0402",true]]});
          break;
        }
        case "0400":{
          let uuidValue = uuid4();
          console.log(receive);
          if(receive[0][2] === 0){
            //create
            uuidValue = `{${uuidValue}}`;
            emit({"code": [["0400",uuidValue,true]]});
          }
          if(receive[0][2] === 1){
            //view
            uuidValue = `{${uuidValue}}`;
            emit({"code": [["0400",uuidValue,true]]});
          }
          break;
        }
        case "0007":{

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
