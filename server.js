require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const AdminSchema = require('./models/Admin');


app.get('/admin', async (req, res) => {
    const hashedPsw = await bcrypt.hash("admin", 12);
    let admin = new AdminSchema( {login: "admin", password: hashedPsw} );
    admin.save();
})

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useUnifiedTopology: true }, function(err){
    if(err) return console.log(err);
    app.listen(process.env.SERVER_PORT, function(){
        console.log("Сервер ожидает подключения...");
    });
});        