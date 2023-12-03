const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // All origins are allowed
    methods: ['GET', 'POST'], // Allowed methods
  },
});

io.on('connection', socket => {
  console.log('a user connected');

  // Listen for screen data
  socket.on('screen-data', data => {
    console.log('Received screen data');
    io.emit('screen-data', data); // Broadcast to all clients
  });

  socket.on('size-data', data => {
    console.log('Received size data', data);
    io.emit('size-data', data); // Broadcast to all clients
  });

  // Listen for control data
  socket.on('control-data', data => {
    console.log('Received control data', data);
    io.emit('control-data', data); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(80, () => {
  console.log('Server is running on port 80');
});

// const http = require('http');
// const cors = require('cors');
// const streamMap = new Map(); // 클라이언트의 ID와 스트림을 매핑하는 맵

// // 스트리밍 중계를 위한 Node.js 서버 생성
// const server = http.createServer((req, res) => {
//   // CORS 설정 추가
//   cors()(req, res, () => {});

//   const urlParts = req.url.split('/');
//   const clientId = urlParts[1]; // URL의 첫 번째 부분을 클라이언트의 ID로 사용

//   if (req.method === 'POST') {
//     console.log('come');
//     // 클라이언트로부터의 POST 요청을 처리하여 스트림을 받음
//     streamMap.set(clientId, req);
//     req.on('end', () => {
//       // 클라이언트의 연결이 끊어지면 클라이언트를 해제
//       streamMap.delete(clientId);
//     });
//   } else if (req.method === 'GET') {
//     if (clientId === 'clients') {
//       // 클라이언트 목록을 반환
//       res.setHeader('Content-Type', 'application/json');
//       res.end(JSON.stringify(Array.from(streamMap.keys())));
//     } else {
//       // 클라이언트로부터의 GET 요청을 처리하여 스트림을 전송
//       const stream = streamMap.get(clientId);
//       if (stream) {
//         stream.pipe(res);
//       } else {
//         res.statusCode = 404;
//         res.end();
//       }
//     }
//   }
// });

// server.listen(8000, () => {
//   console.log('Server is running at http://localhost:8000');
// });
