const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const PORT = 4000;
const router = require('../src/router');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use('/', router)

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})