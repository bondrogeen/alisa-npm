const YandexDevices = require('../build/index').default;

const username = 'xxxxxxxxxxxx';
const password = 'xxxxxxxxxxxx';

let yandexToken = '';

const alisa = new YandexDevices();

(async () => {
  if (!yandexToken) {
    const data = await alisa.getYandexToken({ username, password });
    yandexToken = data?.access_token || '';
  }

  if (!yandexToken) return console.log('not token');

  alisa.setToken(yandexToken);

  console.log(yandexToken);

  alisa.on('data', message => {
    const {
      id, // 'XXXXXXXXXXXXXXXXXXXXX' String - id device
      ip, // 'XXX.XXX.XXX.XXX' String - ip device
      platform, // 'yandexmini' String - platform device
      port, //: 1961 Number - post device
      connected, // true, Boolean - state device
      type, //: 'message', String - type event ['open', 'message', 'error', 'close']
      data, //: Object - raw data on device
    } = message;

    if (type === 'open') {
      alisa.onSend(id, { command: 'setVolume', volume: 0.3 });
      alisa.onSend(ip, { command: 'playMusic', id: '52033142', type: 'track' });
    }

    if (type === 'message') {
      console.log(message);
    }
  });

  alisa.on('connected', data => {
    console.log('connected', data);
    // or
    // console.log(alisa.getState())
  });

  const state = await alisa.connection();

  if (state) {
    console.log(alisa.getState());
  }
})();
