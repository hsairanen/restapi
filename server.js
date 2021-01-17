if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Import frameworks and modules
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// Connect to the database
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true,useNewUrlParser: true}).then( () => {console.log('Connection to the Atlas Cluster is successful!')}).catch((err) => console.error(err));
//const db = mongoose.connection
//db.on('error', (error) => console.error(error));
//db.once('open', () => console.log('Connected to the database.'))

// Initialize the framework
const app = express();

// Views and layouts
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'))

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Override method
app.use(methodOverride('_method'));

// API Routes
const predictions = require('./routes/index')
app.use('/', predictions)
const editpreds = require('./routes/edit')
app.use('/edit/', editpreds)

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
