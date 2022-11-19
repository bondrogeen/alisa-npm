import https from 'https';
import { promises } from 'fs';
import { parse } from 'url';
import querystring from 'querystring';
import mDns from 'node-dns-sd';

const client_id = '23cabbbdc6cd418abb4b39c32c41195d';
const client_secret = '53bc75238f0c4d08a118e51fe9203300';
const path = './db.json';

const fetch = ({ url, method, data = '', headers = {} }) => {
  const formUrlEncoded = querystring.stringify(data);
  const { hostname, path } = parse(url);
  const options = {
    hostname,
    port: 443,
    method,
    path,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': formUrlEncoded.length,
      ...headers,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https
      .request(options, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      })
      .on('error', err => reject(err));
    req.write(formUrlEncoded);
    req.end();
  });
};

const getDeviceList = yandexToken => {
  try {
    const options = {
      url: 'https://quasar.yandex.net/glagol/device_list',
      headers: { Authorization: 'Oauth ' + yandexToken },
    };
    return fetch(options);
  } catch (error) {
    console.error(error);
  }
};

const getDeviceToken = ({ id, platform, yandexToken }) => {
  try {
    return fetch({
      method: 'GET',
      url: `https://quasar.yandex.net/glagol/token?device_id=${id}&platform=${platform}`,
      headers: { Authorization: 'Oauth ' + yandexToken },
    });
  } catch (error) {
    console.error(error);
  }
};

const getYandexToken = ({ username, password }) => {
  try {
    const options = {
      url: `https://oauth.yandex.com/token`,
      method: 'post',
      data: { grant_type: 'password', client_id, client_secret, username, password },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    return fetch(options);
  } catch (error) {
    console.error(error);
  }
};

const readJSON = async () => {
  try {
    const data = await promises.readFile(path, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
const writeJSON = async data => {
  try {
    return await promises.writeFile(path, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};

const findDeviceList = async () => await mDns.discover({ name: '_yandexio._tcp.local', wait: 3 });

export { fetch, getYandexToken, getDeviceToken, getDeviceList, findDeviceList, writeJSON, readJSON };
