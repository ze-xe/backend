const express = require('express');
const {connect} = require('./src/db');
const cors = require('cors');
const { syncAndListen, _syncAndListen } = require('./src/sync/sync');
const app = express();
const routes = require('./src/routes/route');
const { ExchangeConfig } = require('./src/sync/configs/exchange');
const { VaultConfig } = require('./src/sync/configs/vault');
require("dotenv").config();


connect();
app.use(cors());
app.use(express.json());

app.use('/', routes);

syncAndListen(ExchangeConfig);
_syncAndListen(VaultConfig);

app.listen(process.env.PORT || 3010, function () {
    console.log('app running on port ' + (process.env.PORT || 3010));
});