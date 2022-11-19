import { EventEmitter } from 'node:events';
import WebSocket from 'ws';

class Client extends EventEmitter {
  #ws;
  #time;
  #address;
  #options;
  #interval;
  #isConnect;
  #connection;
  #reconnectTime;

  constructor({ address = '', options = {}, reconnectTime = 10000 }) {
    super();
    this.#ws = null;
    this.#time = new Date();
    this.#address = address;
    this.#options = options;
    this.#interval = null;
    this.#connection = true;
    this.#reconnectTime = reconnectTime;
    this.#isConnect = false;
  }
  connect() {
    try {
      this.#ws = new WebSocket(this.#address, this.#options);
      this.#ws.on('open', this.#onOpen.bind(this));
      this.#ws.on('message', this.#onMessage.bind(this));
      this.#ws.on('close', this.#onClose.bind(this));
      this.#ws.on('error', this.#onError.bind(this));
      if (!this.#interval) this.#interval = setInterval(this.#onPing.bind(this), 1000);
      this.#connection = true;
      this.#isConnect = true;
    } catch (error) {
      this.#onReconnect();
    }
  }
  disconnect() {
    this.#isConnect = false;
    if (this.#interval) clearInterval(this.#interval);
    this.#interval = null;
    this.#ws.close();
    this.#ws = null;
    this.emit('close');
  }
  #onReconnect() {
    this.emit('reconnect');
    this.#time = new Date().getTime();
    if (this.#connection) {
      this.connect();
      this.#connection = false;
    }
  }
  send(data) {
    if (this.#isConnect) this.#ws.send(data);
  }
  #onPing() {
    const delta = new Date().getTime() - this.#time;
    this.emit('ping', delta);
    this.#isConnect = delta < 3000;
    if (delta > this.#reconnectTime) this.#onReconnect();
  }
  #onOpen(e) {
    this.emit('open', e);
    this.#connection = true;
    this.#isConnect = true;
  }
  #onMessage(data) {
    this.#time = new Date().getTime();
    this.emit('message', data);
  }
  #onClose(e) {
    this.#isConnect = false;
    this.emit('close', e);
    this.#connection = true;
  }
  #onError(e) {
    this.#isConnect = false;
    this.#ws.terminate();
  }
}

export default Client;
