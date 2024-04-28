const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const router = require('./Routers/UserRouter');
const router1=require('./Routers/AdminRouter')
const mongoose = require('./Auth/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path=require('path')


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/backend/Public', express.static(path.join(__dirname, 'Public')));




app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use('/', router);
app.use('/', router1);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
