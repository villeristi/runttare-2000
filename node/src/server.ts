import express, {Request, Response} from 'express'
import cors from 'cors';
import expressWs, {Application, Instance} from 'express-ws';
import WebSocket from 'ws';

import Runttare, {statusPin} from './runttare';
import {createTable, getCount} from './db';
import {RunttaMsg, countMsg} from './msg';

const wsInstance: Instance = expressWs(express());
const app: Application = wsInstance.app;
const PORT = 8000;

const wss = wsInstance.getWss();
const runttare = new Runttare(wss);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res
          .status(200)
          .send({
            app: 'Runttare 2000',
            version: '0.1.0',
          });
});

app.put('/runtta', (req: Request, res: Response) => {
  runttare.runtta()

  return res
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
  statusPin.writeSync(1);
  console.log(`Server is listening on port ${PORT}`);
});
