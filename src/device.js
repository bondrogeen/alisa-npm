import Client from './clientWS';
import { throttle } from './utils';

class Device extends Client {
  #id;
  #ip;
  #port;
  #key;
  #cert;
  #token;
  #platform;

  constructor({ ip, port = 1961, platform, token, id = '', reconnect = 10000, cert = '', key = '' }) {
    console.log(ip, port, token, id, reconnect, cert, key);
    if (!token || !ip || !port) throw new Error('token | ip | port is undefined');
    let options = { cert, key, rejectUnauthorized: false };
    super({ address: `wss://${ip}:${port}`, reconnect, options });

    this.#id = id;
    this.#ip = ip;
    this.#port = port;
    this.#key = key;
    this.#cert = cert;
    this.#token = token;
    this.#platform = platform;
    this.fetchUpdateToken = null;
    this.onThrottle = throttle(res => this.onMessage('message', res), 1000);
    this.#init();
  }

  get id() {
    return this.#id;
  }

  get ip() {
    return this.#ip;
  }

  #init() {
    this.on('open', e => {
      this.onMessage('open', e);
      this.send({ command: 'ping' });
    });

    this.on('message', e => this.onThrottle(this.#parseMessage(e)));

    this.on('close', e => {
      if (e === 4000 && this.fetchUpdateToken) this.updateToken();
      this.onMessage('close', e);
    });

    this.on('error', e => this.onMessage('error', e));
  }

  async updateToken() {
    const { status, token } = await this.fetchUpdateToken();
    if ((status === 'ok', token)) this.setToken(token);
  }

  #parseMessage(e) {
    try {
      return JSON.parse(e);
    } catch (error) {
      console.error(error);
    }
  }

  #getFormDate(payload) {
    return {
      conversationToken: this.#token,
      id: this.#id,
      payload,
      sentTime: Date.now(),
    };
  }

  #getSendData(type, data) {
    return {
      id: this.#id,
      ip: this.#ip,
      type,
      data,
    };
  }

  setToken(token) {
    this.#token = token;
  }

  send(payload) {
    super.send(JSON.stringify(this.#getFormDate(payload)));
  }

  onMessage(type, data) {
    this.emit('data', this.#getSendData(type, data));
  }
}

export default Device;
