require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const expbs = require('express-handlebars');
const path = require('path');

const app = express();
const AdminSchema = require('./models/Admin');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'handlebars');

app.engine('handlebars', expbs({ 
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) return console.log(err);
    app.listen(process.env.SERVER_PORT, function(){
        console.log("Сервер ожидает подключения...");
    });
});

const store = new MongoDBSession({
    uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    collection: 'sessionStore'
})

app.post('/adminLogIn', async (req, res) => {
    const { login, password } = req.body;

    let admin = AdminSchema.findOne({ login }, (err, admin) => {
        if(!admin) { 
            return res.redirect('/');
        }
        
        const isMatch = bcrypt.compareSync(password, admin.password);
        if(!isMatch) return res.redirect('/');
    
        res.redirect('/succ');
    });
    

})

app.get('/', async (req, res) => {
    // const hashedPsw = await bcrypt.hash("qwerty123", 12);
    // let admin = new AdminSchema( {login: "admin", password: hashedPsw} );
    // admin.save();

    res.render("admin")
})