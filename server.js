// node/express app starts here!

// const querystring = require('querystring')
const express = require('express')
const moment = require('moment')
// const bodyParser = require('body-parser')
const app = express()

// app.use(bodyParser.urlencoded({ extended: false })); //https://github.com/expressjs/body-parser

//this middleware is acting as an endpoint that handles all requests to server.
app.all('*', (req,res,next)=>{
  let unixTimestamp, naturalDate
  let inputStr = req.originalUrl.slice(1).replace(/%20/g,' ')

  //create a local moment from a Unix timestamp (seconds since the Unix Epoch),convert to utc, then format display
  // console.log( moment.unix('1450137600').utc().format('MMMM Do, YYYY') )
  // console.log( moment.unix(inputStr).utc().format('MMMM Do, YYYY') )

  //check if the provided string will return a valid 'moment' date when parsed
  if( !moment.unix(inputStr).isValid() && !moment(inputStr,
    [
      'M-D-YY','M D YY',
      'MMM-D-YY','MMM D YY',
      'MMMM-D-YY','MMMM D YY',
      'M-D-YYYY','M D YYYY',
      'MMM-D-YYYY','MMM D YYYY',
      'MMMM-D-YYYY','MMMM D YYYY'
    ],true)
    .isValid() ) {
    res.send('server did not receive a date')
  }
  else {
    //set values for properties in the response object
    unixTimestamp = moment.unix(inputStr).utc().unix()
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
      .format('MMMM Do, YYYY')
    //respond with an object as a json encoded string. send() is smart enough to handle it instead of res.json()
    res.send( { unix:unixTimestamp, natural:naturalDate } )
  }

})

// listen for requests. uncomment line depending on server. choose first for glitch, as the .env files with the port will become available when their site hosts the app. or use the second when running this app locally
// var listener = app.listen(process.env.PORT, function () {
const listener = app.listen( 5000, function () {
  console.log('Listening on port: ' + listener.address().port)
})
