const YandexDevices = require('../build/index').default;

// const username = 'xxxxxxxxxx';
// const password = 'xxxxxxxxxx';
// const alisa = new YandexDevices({ username, password });

//  or

const yandexToken = 'xx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const alisa = new YandexDevices({ yandexToken });

alisa.init();

alisa.on('data', data => {
  console.log(data);
});


alisa.onSend('192.168.10.23', {
  command: 'setVolume',
  volume: 0.1,
});

alisa.onSend('FF98F0299D8593E41F504368', {
  command: 'setVolume',
  volume: 0.5,
});
