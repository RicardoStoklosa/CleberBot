var axios = require('axios');

const api = axios.create({
    baseURL: 'https://api.mcsrvstat.us/1'
});

module.exports = api;