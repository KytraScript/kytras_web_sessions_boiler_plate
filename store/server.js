const express = require('express');
const app = express();
const compression = require('compression');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const uuid = require('node-uuid');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const settings = require('../env/storeConfiguration.js');

const connectionOptions = settings.connectionOptions;
const storeOptions = settings.storeOptions;
const connection = mysql.createPool(connectionOptions);
const sessionStore = new MySQLStore(storeOptions, connection);

app.use(compression());
app.use(cookieParser());
app.use(session({
    genid: function() {
        return crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
    },
    cookie: {},
    secret: 'Geno Blast',
    store: sessionStore
}));

app.get('/', (req, res) => {
    res.send(req.sessionID);
});

app.listen(5500, () => console.log('Sessions Server running on Port 5500'));
