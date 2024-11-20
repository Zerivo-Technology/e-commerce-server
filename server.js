require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const PORT = 3000;
const router = require('./router/index.js');
// -- IMPELEMENTATION -- //
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(router)


app.listen(PORT, () => {
    console.log(`Server Berjalan http://localhost:${PORT}`);
})