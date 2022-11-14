const express = require('express');
const {connect} = require('./src/db');
const cors = require('cors');
const { syncAndListen, syncAndListen1 } = require('./src/sync/sync');
const app = express();
const routes = require('./src/routes/route');
const { ExchangeConfig } = require('./src/sync/configs/exchange');
const { VaultConfig } = require('./src/sync/configs/vault');
require("dotenv").config();


connect();
app.use(cors());
app.use(express.json());

app.use('/', routes);

syncAndListen(ExchangeConfig, "1313161555");
syncAndListen1(VaultConfig, "1313161555");

app.listen(process.env.PORT || 3010, function () {
    console.log('app running on port ' + (process.env.PORT || 3010));
});