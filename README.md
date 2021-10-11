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
const Alisa = require("alisa-npm");
const token = '<your_token>' // your Yandex token
const alisa = new Alisa({ token })

alisa.on("message", (device, message) => {
  console.log(message);
});

alisa.on("state", (message) => {
  console.log('state', message);
});

alisa.start()

```
## State
```JSON
{ 
  "id": "FF98FF2FFD859FF41F5FF368", 
  "state": { 
    "status": "init", // or "open", "active", "close"
    "code": 1006, // only "status" = "close"
    "reason": "<Buffer >" // only "status" = "close"
  } 
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
## Alisa parameters
```
new Alisa({ [token], [name], [debug] });
```
token - Yandex token your account.  default: null<br>
name - Search mDns name. default: '_yandexio._tcp.local'<br>
debug - Debug messages. default: false<br>





#### 0.1.2
* (bondrogeen) add this.getState()

#### 0.1.1
* (bondrogeen) initial release

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