// node/express app starts here!

const express = require('express')
const bodyParser = require('body-parser')
// const multer  = require('multer') //reinstall multer package, then uncomment to handle multipart/form-data content-type
// const upload = multer()
const app = express()

app.use(express.static('public'))

app.get("/", function (request, response) {
  console.log('get request to /')
  // response.send('<p>Hello World!</p>')
  // response.download('./README.md')
  response.sendFile(__dirname + '/views/index.html')
})

//pug template rendering
app.set('view engine', 'pug')
app.set('views', __dirname + '/views' )
app.get('/pugrender', (req,res)=>{
  console.log('get request to /pugrender')
  //res.render accepts a template filename (like the pug file) and data called locals
  res.render('index', {date: new Date().toDateString()} )
})

app.get("/dreams", function (request, response) {
  console.log('get request to /dreams')
  response.send(dreams)
})
// Simple in-memory store for now
let dreams = [ "Find and count some sheep", "Climb a really tall mountain", "Wash the dishes" ]

// //multer route to handle content-type multipart/form-data. form field values in request.body
// app.post('/dreams', upload.array(), (request, response, next)=> {
//   console.log('post request to /dreams')
//   console.log(request.body)
//   // console.log(request.headers)
//   response.send("server received all data from POST request")
  
// })

app.use( bodyParser.json() )//for parsing application/json body content-types, will add the value to request.body

app.post("/dreams", (request, response)=> {
  console.log('post request to /dreams')
  // console.log(request.headers)
  console.log(request.body)
  response.send("server received all data from POST request")
  //push item to store, so page refresh shows what user has inputted so far
  dreams.push(request.body.todo)
})

// listen for requests. uncomment line depending on server. choose first for glitch, as the .env files with the port will become available when their site hosts the app. or use the second when running this app locally
// var listener = app.listen(process.env.PORT, function () {
const listener = app.listen( 5000, function () {
  console.log('Listening on port: ' + listener.address().port)
})
