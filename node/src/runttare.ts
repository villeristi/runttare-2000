import WebSocket from 'ws';
import process from 'process';
import {Gpio, High, Low} from 'onoff';

import { getCount, increment } from './db';
import {RunttaMsg, MsgType, StatusType, statusMsg, countMsg} from './msg';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const pistonPin = new Gpio(17, 'out');
export const statusPin = new Gpio(4, 'out');

export default class Runttare {
  private wss: WebSocket.Server;
  private busy: boolean = false;

  constructor(ws: WebSocket.Server) {
    this.wss = ws;
  }

  async runtta() {
    this.changeStatus();

    pistonPin.writeSync(1);

    await sleep(3000);

    pistonPin.writeSync(0);

    this.sendSuccess();
  }

  async sendSuccess () {
    this.changeStatus();
    await increment();
    this.broadcast(countMsg(await getCount()));
  }

  changeStatus() {
    this.busy = !this.busy;
    this.broadcast(statusMsg(this.busy));
  }

  broadcast(msg: RunttaMsg) {
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg), { binary: false });
      }
    });
  }
}
