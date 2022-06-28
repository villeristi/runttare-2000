import WebSocket from 'ws';
import process from 'process';
import {Gpio, High, Low} from 'onoff';

import { getCount, increment } from './db';
import {RunttaMsg, MsgType, StatusType, statusMsg, countMsg} from './msg';

const PISTON_PIN = Number(process.env.RUNTTA_PISTON_PIN) || 17;
const STATUS_PIN = Number(process.env.RUNTTA_STATUS_PIN) || 27;
const RUNTTA_TIMEOUT = Number(process.env.RUNTTA_TIMEOUT) || 3000;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const pistonPin = new Gpio(PISTON_PIN, 'out');
export const statusPin = new Gpio(STATUS_PIN, 'out');

export default class Runttare {
  private wss: WebSocket.Server;
  private busy: boolean = false;

  constructor(ws: WebSocket.Server) {
    this.wss = ws;
    statusPin.writeSync(1);
  }

  getStatus() {
    return this.busy;
  }

  async runtta() {
    this.changeStatus();

    pistonPin.writeSync(1);

    await sleep(RUNTTA_TIMEOUT);

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
