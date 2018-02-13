// node/express app starts here!

const express = require('express')
const moment = require('moment')
const app = express()

//this middleware handles all requests to server. can also just use app.use(fn)
app.all('*', (req,res,next)=>{
  let unixTimestamp, naturalDate
  //grab the input from the url while handling spaces
  const inputStr = req.originalUrl.slice(1).replace(/%20/g,' ')

  //create a local moment from a Unix timestamp (seconds since the Unix Epoch) from str or num, use utc mode, then format display
  // console.log( moment.unix('1450137600').utc().format('MMMM Do, YYYY') )

  //show launchpage for empty input
  if( req.originalUrl === '/' ) {
    //respond with an object as a json encoded string. send() is smart enough to handle it instead of res.json()
    res.send( "In the url after a '/', give me a unix timestamp or month-day-year date delimited by spaces or hyphens" )
  }
  else{
    //check if the input is actually a date in either format
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
      //respond with an object as a json encoded string. send() is smart enough to handle it instead of res.json()
      res.send( { unix:null, natural:null } )
    }
    //the input is valid, respond accordingly
    else {
      // check if the input was a number, signed or not
      if ( /^-?[0-9]+$/.test(inputStr) ) {
        // console.log('received unix timestamp: ', inputStr)
        //set vars accordingly, to use in response object
        unixTimestamp = moment.unix(inputStr).utc().unix() //you could also just display as a string directly
        naturalDate = moment.unix(inputStr).utc().format('MMMM Do, YYYY')
      }
      //received a non unix date...
      else{
        //set vars accordingly, to use in response object
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
        unixTimestamp = moment.utc(inputStr,
          [
            'M-D-YY','M D YY',
            'MMM-D-YY','MMM D YY',
            'MMMM-D-YY','MMMM D YY',
            'M-D-YYYY','M D YYYY',
            'MMM-D-YYYY','MMM D YYYY',
            'MMMM-D-YYYY','MMMM D YYYY'
          ],true).unix()
  
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