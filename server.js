// node/express app starts here!

const express = require('express')
const moment = require('moment')
path = require('path')
const app = express()

//specify template engine for express to use
app.set('view engine', 'pug')
//specify a PATH for template files. fallback to yours if none provided as cmd-line arguments. join() just returns appropriate win/unix path 
app.set('views', path.join(__dirname, 'views') )
//host css files. they will appear at server root with same level where index.html is hosted
app.use( express.static( path.join(__dirname,'public') ) )

//this middleware handles all requests to server. can also just use app.use(fn)
app.all('*', (req,res,next)=>{
  let unixTimestamp, naturalDate
  //grab the input from the url while handling spaces
  const inputStr = req.originalUrl.slice(1).replace(/%20/g,' ')

  //create a local moment from a Unix timestamp (seconds since the Unix Epoch) from str or num, use utc mode, then format display
  // console.log( moment.unix('1450137600').utc().format('MMMM Do, YYYY') )

  //show launchpage for empty input
  //res.render accepts a template filename (like the pug file) and data called locals
  if( req.originalUrl === '/' ) res.render('index')
  else{
    //make both moment objects from the input. you can check them later using isValid() and display them
    //accepts string dates as month-day-year delimited by spaces or hyphens
    naturalDate = moment.utc(inputStr,
      [
        'M-D-YY','M D YY',
        'MMM-D-YY','MMM D YY',
        'MMMM-D-YY','MMMM D YY',
        'M-D-YYYY','M D YYYY',
        'MMM-D-YYYY','MMM D YYYY',
        'MMMM-D-YYYY','MMMM D YYYY'
      ],true)
    // console.log('date from natural format parser',naturalDate)
    unixTimestamp = moment.unix(inputStr).utc()
    // console.log('date from unix format parser',unixTimestamp)

    //check if the moment objects are valid dates....
    if( !naturalDate.isValid() && !unixTimestamp.isValid() )
      res.send( { unix:null, natural:null } )
    //now we know at least one of the inputs is a valid date. respond accordingly
    else {
      // check if the input was a unix timestamp, signed or not, then set vars from unix timestamp moment
      // if ( /^-?[0-9]+$/.test(inputStr) ) {
      if ( unixTimestamp.isValid() ) {
        naturalDate = unixTimestamp.clone()
        unixTimestamp = unixTimestamp.unix() //this moment object must be valid, so use it for display
        naturalDate = naturalDate.format('MMMM Do, YYYY')
      }
      //if input was a natural date instead, set vars from natural date moment
      else{
        unixTimestamp = naturalDate.clone()
        naturalDate = naturalDate.format('MMMM Do, YYYY')
        unixTimestamp = unixTimestamp.unix()
      }
      //respond with an object as a json encoded string. send() is smart enough to handle it instead of res.json()
      res.send( { unix:unixTimestamp, natural:naturalDate } )
    }

  }

})

// listen for requests. uncomment line depending on server. choose first for glitch, as the .env files with the port will become available when their site hosts the app. or use the second when running this app locally
// var listener = app.listen(process.env.PORT, function () {
const listener = app.listen( 5000, function () {
  console.log('Listening on port: ' + listener.address().port)
})