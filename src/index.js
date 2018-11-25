// Dependencies
// use import instead of express - its the new syntax of Javascript ES6
// but unfortunately import is not yet officially supported by nodejs
// you can use an experimental flag in node 9 to use import: https://stackoverflow.com/questions/39436322/node-js-syntaxerror-unexpected-token-import
// or you can use babel - see changes made to package.json
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import api from './routes/api'
// Express
var app = express()
// bodyparser is required just once
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// read why do we need the next two lines

// this is for static files
app.use(express.static('./resources/WEB'))

// this is for request logging
app.use(morgan('short'))
// Routes

app.use('/api/', api)

// what is the difference between res.send, res.json, res.render, res.end
app.get('/', function (req, res) {
  res.send('Welcome!')
})

// what is the difference between normal functions and arrow functions
app.get('/test', function (req, res) {
  res.send({
    'Name': 'Nick',
    'ID': 1897,
    'Age': 21,
    'Address': '296/16A, FBD',
  })
})

app.listen(4000, () => {
  console.log('API is running on PORT : 4000')
})
