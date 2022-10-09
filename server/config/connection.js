const mongoose = require('mongoose');
const path = require('path');
const rasta = path.join(__dirname,'../config.env');
require('dotenv').config({ path: rasta });
const url = process.env.DATABASE;

const conn = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('success connection'))
.catch((err) => console.log(err))

module.exports=conn;