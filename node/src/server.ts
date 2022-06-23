import express from 'express'
import expressWs, {Application, Instance} from 'express-ws';
import WebSocket from 'ws';

import Runttare from './runttare';
import {createTable, getCount} from './db';
import {RunttaMsg, countMsg} from './msg';

const wsInstance: Instance = expressWs(express());
const app: Application = wsInstance.app;
const PORT = 8000;

const wss = wsInstance.getWss();
const runttare = new Runttare(wss);

app.use(express.json());

app.get('/runtta', (req, res) => {
  runttare.runtta()

  res
    .status(202)
    .send('OK');
});

app.ws('/ws', async function(ws: WebSocket, req) {
  // Send initial value on connect
  const msg: RunttaMsg = countMsg(await getCount());

  ws.send(JSON.stringify(msg));
});

app.listen(PORT, () => {
  createTable();
  console.log(`Server is listening on port ${PORT}`);
});
