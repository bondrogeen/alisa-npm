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

// Yandex  login and password
// const username = 'xxxxxxxxxx';
// const password = 'xxxxxxxxxx';
// const alisa = new YandexDevices({ username, password });

//  or yandex token

const yandexToken = 'xx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const alisa = new YandexDevices({ yandexToken });

alisa.init();

alisa.on('data', data => {
  console.log(data);
});

alisa.onSend('192.168.10.22', {
  command: 'setVolume',
  volume: 0.1,
});

alisa.onSend('FF98F0299D8593E41F504368', {
  command: 'setVolume',
  volume: 0.5,
});
```

## State

```JSON
{
  "id": "FF98F0299D8593E41F504368",
  "ip": "192.168.10.22",
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
new YandexDevices({ [username], [password], [yandexToken], [save] });
```

yandexToken - Yandex token your account. default: ''<br>
username - Yandex login your account. default: ''<br>
password - Yandex password your account. default: ''<br>
save - Save device configuration.. default: true<br>

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
