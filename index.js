const WebSocket = require("ws");
const axios = require('axios');
const mDns = require('node-dns-sd');
var util = require("util");
var EventEmitter = require("events").EventEmitter;

const formUrlEncoded = x => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
const url_oauth = `https://oauth.yandex.com/token`;
const client_id = '23cabbbdc6cd418abb4b39c32c41195d';
const client_secret = '53bc75238f0c4d08a118e51fe9203300';

const urlToken = 'https://quasar.yandex.net/glagol/token'
const urlDeviceList = 'https://quasar.yandex.net/glagol/device_list'

const alisa = function ({ token = null, name = '_yandexio._tcp.local', debug = false, throttle = 1000 }) {
  EventEmitter.call(this);

  const self = this
  self.devices = [];
  self.name = name
  self.token = token
  self.debug = debug
  self.throttle = throttle

  self.setToken = (token) => {
    self.token = token
  }

  function debug (value) {
    if (self.debug) {
      console.log(value)
    }
  }

  function funcThrottle (func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    const later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.call(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      const now = Date.now();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
      context = this;
      args = { ...args, ...arguments[0] };
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.call(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  function getHeader () {
    return {
      'Authorization': 'Oauth ' + self.token,
      'Content-Type': 'application/json'
    }
  }

  self.getYandexToken = async function ({ username, password }) {
    try {
      const { data } = await axios({
        method: "post",
        url: url_oauth,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: formUrlEncoded({
          grant_type: 'password',
          client_id: client_id,
          client_secret: client_secret,
          username,
          password
        })
      });
      return data
    } catch (error) {
      debug(error)
    }
  }

  self.sendThrottle = funcThrottle(function (messages) {
    self.emit("message", messages);
    // console.log(Date.now())
  }, self.throttle)

  self.getState = function () {
    const info = {
      name: self.name,
      devices: self.devices.map(({ id, ip, port, platform, state = {} }) => {
        return { id, ip, port, platform, state }
      }),
      token: self.token
    }
    return JSON.parse(JSON.stringify(info))
  }
  self.findDevices = async function () {
    try {
      const res = await mDns.discover({ name: self.name })
      self.devices = res.map(({ address, service: { port }, packet: { answers } }, i) => {
        const { rdata } = answers.find(item => item.type === 'TXT') || {}
        const { deviceId, platform } = rdata || {}
        return (address && port && deviceId && platform) ? { id: deviceId, ip: address, port, platform } : null
      }).filter(item => item)
      return self.devices
    } catch (error) {
      debug(error)
    }
  }

  self.getListDevices = async function () {
    try {
      const { data } = await axios({
        method: "get",
        url: urlDeviceList,
        headers: getHeader()
      });
      return { data, status: 'done' }
    } catch ({ response }) {
      debug(response.data)
      return response.data
    }
  }

  self.getLocalToken = async function ({ id, platform }) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${urlToken}?device_id=${id}&platform=${platform}`,
        headers: getHeader()
      });
      return data
    } catch ({ response }) {
      debug(response.data)
      return null
    }

  }

  self.start = async function () {
    if (!self.token) {
      debug('no token')
      return new Error('no token');
    }
    try {
      let res = await self.getListDevices()
      if (!res.data) {
        return res;
      }
      let { devices: list } = res.data;
      let devices = await self.findDevices()
      const allToken = []
      devices.forEach((device) => {
        allToken.push(self.getLocalToken(device))
      })
      const tokens = await Promise.all(allToken)
      devices = devices.map((device, i) => {
        const yaDevice = list.find(item => item.id === device.id)
        if (tokens[i].token && yaDevice) {
          device.security = yaDevice.glagol.security
          device.token = tokens[i].token
          return device
        } else {
          if (!device) {
            debug('no device', device, security)
          }
          return null
        }

      }).filter(device => device)
      self.devices = devices
      if (devices.length) {
        devices.forEach(device => {
          self.connection(device)
        })
      } else {
        debug(devices)
      }
      return { status: 'done' }
    } catch (error) {
      debug(error)
    }
  }

  self.connection = function (device) {
    let options = {
      key: device.security.server_private_key,
      cert: device.security.server_certificate,
      rejectUnauthorized: false
    };
    device.state = { status: 'init' };
    self.emit("state", { id: device.id, state: device.state });
    device.ws = new WebSocket(`wss://${device.ip}:${device.port}`, options);

    device.ws.on('open', function open () {
      device.state = { status: 'open' };
      self.emit("state", { id: device.id, state: device.state });
      sendMessage({ id: device.id, message: { command: 'ping' } });
      device.watchDog = setTimeout(() => device.ws.close(), 10000);
      // device.ping = setInterval(ping, 1000, device);
      clearTimeout(device.timer);
    });
    device.ws.on('message', function incoming (data) {
      try {
        let res = JSON.parse(data);
        if (device.state.status !== 'active') {
          device.state = { status: 'active' };
          self.emit("state", { id: device.id, state: device.state });
        }
        if (self.throttle) {
          self.sendThrottle({ [device.id]: res })
        } else {
          self.emit("message", { [device.id]: res });
        }
      } catch (error) {
        debug(error)
      }
      clearTimeout(device.watchDog);
      device.watchDog = setTimeout(() => { device.ws.close() }, 10000);
    });
    //device.ws.on('ping', function);
    device.ws.on('close', function close (code, reason) {
      device.state = { status: 'close', code, reason };
      self.emit("state", { id: device.id, state: device.state });
      clearTimeout(device.watchDog);
      if (code === 1000 || code === 10000) {
        debug(`Closed connection code: ${code}, reason: ${reason}. Reconnecting...`);
        self.connection(device);
      } else if (code === 1006) {
        debug(`Closed connection code: ${code}, reason: ${reason}. Lost server. Reconnecting in 60 seconds.`);
        device.timer = setTimeout(self.connection, 60000, device);
      } else if (code === 4000) {
        debug(`Closed connection code: ${code}, reason: ${reason}. Getting new token...`);
        self.connection(device);
      } else {
        debug(`Closed connection code: ${code}, reason: ${reason}. Reconnecting in 60 seconds.`);
        device.timer = setTimeout(self.connection, 60000, device);
      }
    })
    device.ws.on('error', function error (data) {
      device.state = { status: 'error' };
      self.emit("state", { id: device.id, state: device.state });
      debug(`error: ${data}`);
      device.ws.terminate();
    });
  };

  function ping (device) {
    if (device) { sendMessage(device.id, { command: 'ping' }); }
  }

  self.send = function (data) {
    sendMessage(data)
  }

  function sendMessage ({ id, message }) {
    let device = self.devices.find(item => item.id === id);
    try {
      if (device && device.ws) {
        if (device.ws.readyState == 1) {
          let data = {
            "conversationToken": device.token,
            "id": device.id,
            "payload": message,
            "sentTime": Date.now()
          }
          device.ws.send(JSON.stringify(data));
          return 'ok'
        } else {
          return 'Device offline'
        }
      }
    } catch (err) {
      debug(`Error message: ${err}`);
    }
  }
}

util.inherits(alisa, EventEmitter);
module.exports = alisa;