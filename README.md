# Alisa-npm [BETA]

Controlling Yandex Alice via a web socket

![image](https://raw.githubusercontent.com/bondrogeen/alisa-npm/main/images/image.jpg)

## Installation

Install from NPM

```
npm install alisa-npm
```

Install from GIT

```
npm install https://github.com/bondrogeen/alisa-npm
```

## Usage

```javascript
const YandexDevices = require('alisa-npm');

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
```

## State

```JSON
{
  "id": "FF98F0299D8593E41F504368",
  "ip": "192.168.10.22",
  "platform": "yandexmini",
  "port": 1961,
  "connected": true,
  "type": "message",
  "data": {}
}
```

## Message yandex mini

```JSON
{
  "experiments": {
    "audio_bitrate192": "1",
    "enable_multiroom": "1",
    "ether": "https://yandex.ru/portal/station/main",
    "mm_disable_protocol_scenario=MordoviaVideoSelection": "1",
    "mm_enable_session_reset": "1",
    "mordovia": "1",
    "mordovia_long_listening": "1",
    "mordovia_support_channels": "1",
    "recurring_purchase": "1",
    "video_disable_films_webview_searchscreen": "1",
    "video_disable_webview_searchscreen": "1"
  },
  "extra": {},
  "id": "52c56e35-600d-4bf1-9d85-0f223490d4ea",
  "sentTime": 1633533261234,
  "state": {
    "aliceState": "IDLE",
    "canStop": true,
    "hdmi": {
      "capable": false,
      "present": false
    },
    "playerState": {
      "duration": 151.24,
      "entityInfo": {
        "description": "",
        "id": "user:onyourwave",
        "shuffled": false,
        "type": "RADIO"
      },
      "extra": {
        "coverURI": "avatars.yandex.net/get-music-content/4406810/4732d077.a.13586183-1/%%",
        "requestID": "a3862158-789e-49d5-af63-2bba2d8dec8d",
        "stateType": "music"
      },
      "hasNext": true,
      "hasPause": true,
      "hasPlay": false,
      "hasPrev": true,
      "hasProgressBar": true,
      "id": "76866096",
      "liveStreamText": "",
      "playerType": "music_thick",
      "playlistDescription": "",
      "playlistId": "user:onyourwave",
      "playlistType": "RADIO",
      "progress": 40,
      "showPlayer": false,
      "subtitle": "FREE",
      "title": "Title",
      "type": "track"
    },
    "playing": true,
    "timeSinceLastVoiceActivity": 3288,
    "volume": 0.3
  },
  "supported_features": [],
  "unsupported_features": []
}
```

## YandexDevices parameters

```
new YandexDevices([yandexToken]);
```

yandexToken - Yandex token your account. default: ''<br>

#### 1.2.0

- (bondrogeen) Change

#### 1.1.1

- (bondrogeen) Rewrote

#### 0.1.3

- (bondrogeen) add Limiting the number of responses

#### 0.1.2

- (bondrogeen) add this.getState()

#### 0.1.1

- (bondrogeen) initial release

## License

The MIT License (MIT)

Copyright (c) 2021 bondrogeen <bondrogeen@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
