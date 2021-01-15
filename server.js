if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Import frameworks and modules
//require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

// Initialize the framework
const app = express();

// Views and layouts
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'))

// Connect to the database
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true,useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to the database.'))

// Body Parser Middleware
app.use(express.json());

// API Routes
const predictions = require('./routes/predictions')
app.use('/', predictions)

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
