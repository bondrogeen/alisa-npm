import { EventEmitter } from 'node:events';
import Device from './device';
import { getDeviceList, getYandexToken, getDeviceToken, findDeviceList, readJSON, writeJSON } from './service';

class YandexDevices extends EventEmitter {
  constructor({ username, password, yandexToken, save = true }) {
    super();
    this.devices = [];
    this.username = username;
    this.password = password;
    this.yandexToken = yandexToken;
    this.save = save;
  }

  async init() {
    let devices = await readJSON();
    if (!devices?.length) {
      if (!this.yandexToken) await this.getYandexToken();
      const localDevices = await this.findDeviceList();
      devices = await this.getAllToken(localDevices);
      await writeJSON(devices);
    }
    this.conection(devices);
  }

  conection(devices) {
    try {
      devices.forEach((device, index) => {
        this.devices[index] = new Device(device);
        this.devices[index].fetchUpdateToken = getDeviceToken.bind(this.devices[index], { ...device, yandexToken: this.yandexToken });
        this.devices[index].connect();
        this.devices[index].on('data', this.onMessage.bind(this));
      });
      this.emit('connected');
    } catch (error) {
      console.log(error);
    }
  }

  async clear() {
    await writeJSON([]);
  }

  onMessage(data) {
    this.emit('data', data);
  }

  onSend(find, data) {
    const device = this.devices.find(item => {
      return item.id === find || item.ip === find;
    });
    if(device) device.send(data)
  }

  async getYandexToken() {
    const { username, password } = this;
    const res = await getYandexToken({ username, password });
    if (res?.access_token) this.yandexToken = res.access_token;
    return res;
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
    return await getDeviceList(this.yandexToken);
  }

  async getAllToken(devices) {
    const all = [];
    const yandexToken = this.yandexToken;
    devices.forEach(device => {
      all.push(getDeviceToken({ ...device, yandexToken }));
    });
    const tokens = await Promise.all(all);
    return devices.map((item, index) => ({ ...item, token: tokens?.[index]?.token || '' }));
  }
}

export default YandexDevices;
