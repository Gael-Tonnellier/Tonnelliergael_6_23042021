const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path =require('path');
//const stuffRoutes = require('./routes/stuff');
//const userRoutes =require('./routes/user');

const app =express();

mongoose.connect('mongodb+srv://gael:gaellivrable@cluster0.lx0w9.mongodb.net/Livrable?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log('Connexion à MongoDB réussie !'))
.catch(()=> console.log('Connexion à MongoDB échouée'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//app.use('/api/sauces',SaucesRoutes);
//app.use('/api/auth',userRoutes);

module.exports = app;