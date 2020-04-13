const express =  require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Database
// mongoose.connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })
//     .then( () => { console.log("DB connected") } )
//     .catch( (err) => console.log("DB ERROR:", err) )

// Importing route
const authRoutes = require('./routes/auth')
// App middlewares
app.use(morgan( 'dev'))
app.use(bodyParser.json())
// app.use(cors()) //Allow all origins. But you may want to restrict
if( process.env.NODE_ENV = "development" )
    app.use( cors( {origin: `http://localhost:3000` } ) )
 
// Middleware
app.use( "/api",authRoutes )

const port = process.env.port || 8000
app.listen( port, ()=>{
    console.log( `App runnign on port ${port} - ${process.env.NODE_ENV}` )
})