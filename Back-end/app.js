require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path =require('path');
const saucesRoutes = require('./routes/sauces');
const userRoutes =require('./routes/user');

const app =express();

// METHODE DE CONNECTION A LA DB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lx0w9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log('Connexion à MongoDB réussie !'))
.catch(()=> console.log('Connexion à MongoDB échouée'));

//HEADER POUR PERMETTRE ECHANGE ENTRE SERVEURS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//INDIQUE A EXPRESS DE GERER LES IMAGES DE MANIERES STATIQUE
app.use('/images', express.static(path.join(__dirname,'images')))

app.use('/api/sauces',saucesRoutes);
app.use('/api/auth',userRoutes);

module.exports = app;