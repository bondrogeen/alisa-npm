import { EventEmitter } from 'node:events';
import Device from './device';
import { getDeviceList, getYandexToken, getDeviceToken, findDeviceList } from './service';

class YandexDevices extends EventEmitter {
  #token;
  #devices;
  #localDevices;
  #cloudDevices;
  #isConnected;
  constructor(token) {
    super();
    this.#devices = [];
    this.#isConnected = false;
    this.#localDevices = [];
    this.#cloudDevices = [];
    this.#token = token;
  }

  async setToken(token) {
    if (!token) return;
    this.#token = token;
    const { devices, status } = await this.getDeviceList();
    if (!devices || !status) {
      this.#token = '';
      return;
    }
    this.#cloudDevices = devices;
    return true;
  }

  getState() {
    return {
      token: Boolean(this.#token),
      localDevices: this.#localDevices,
      cloudDevices: this.#cloudDevices,
      devices: this.#devices.map(device => {
        return device.getInfo();
      }),
    };
  }

  async scan() {
    const localDevices = await this.findDeviceList();
    if (localDevices.length) {
      this.#localDevices = await this.getAllToken(localDevices);
    }
    return this.#localDevices;
  }

  async connection() {
    if (!this.#token) {
      console.warn('not token');
      return;
    }
    await this.scan();
    try {
      const ids = this.#devices.map(i => i.id);
      this.#localDevices.forEach((device, index) => {
        const id = device.id;
        if (ids.includes(id)) return;
        this.#devices[index] = new Device(device);
        this.#devices[index].fetchUpdateToken = getDeviceToken.bind(this.#devices[index], { ...device, token: this.#token });
        this.#devices[index].connect();
        this.#devices[index].on('data', this.onMessage.bind(this));
      });
      const state = this.getState();
      if (this.#localDevices.length) {
        this.#isConnected = true;
        this.emit('connected', state);
      }
      return state;
    } catch (error) {
      console.log(error);
    }
  }

  disconnection() {
    try {
      this.#devices.forEach(device => {
        device.disconnect();
      });
      this.#devices = [];
      this.#isConnected = false;
      this.emit('disconnected');
    } catch (error) {
      console.log(error);
    }
  }

  onMessage(data) {
    this.emit('data', data);
  }

  onSend(find, data) {
    const device = this.#devices.find(item => {
      return item.id === find || item.ip === find;
    });
    if (device) device.send(data);
  }

  async getYandexToken({ username, password }) {
    return await getYandexToken({ username, password });
  }

  async findDeviceList() {
    const list = await findDeviceList();
    return list
      .map(({ address, service: { port }, packet: { answers } }) => {
        const { rdata } = answers.find(item => item.type === 'TXT') || {};
        const { deviceId, platform } = rdata || {};
        return address && port && deviceId && platform ? { id: deviceId, ip: address, port, platform } : null;
      })
      .filter(i => i);
  }

  async getDeviceList() {
    return await getDeviceList(this.#token);
  }

  async getAllToken(devices) {
    const all = [];
    const token = this.#token;
    devices.forEach(device => {
      all.push(getDeviceToken({ ...device, token }));
    });
    const tokens = await Promise.all(all);
    return devices.map((item, index) => ({ ...item, token: tokens?.[index]?.token || '' }));
  }
}

export default YandexDevices;
