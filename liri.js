require("dotenv").config();
const keys = require("./keys.js");
console.log(keys)
var command  = process.argv[2]
console.log(command)
var argument = process.argv.slice(3).join(" ")
console.log(argument)




var validCommands = {
    'concert-this':function(artist){
        // * Name of the venue

        // * Venue location
   
        // * Date of the Event (use moment to format this as "MM/DD/YYYY")
        // todo RETURN THE ABOVE
        var encoded = encodeURIComponent(artist)
        var end_point = `https://rest.bandsintown.com/artists/${encoded}/events?app_id=codingbootcamp`
        make_api_call(end_point, function(data){
            var status = data.status
                console.log(data)
            if(status !== 200){
                console.log(data.status)
                return
            }
            if(status === 200){

                var info = data.data

                if(info.length > 0){

                    //TODO: Show output of data

                }
            }
           


        })


    },
    'spotify-this-song':function(songName){
                //         * This will show the following information about the song in your terminal/bash window

                //      * Artist(s)

                //      * The song's name

                //      * A preview link of the song from Spotify

                //      * The album that the song is from

                //    * If no song is provided then your program will default to "The Sign" by Ace of Base.
                var Spotify = require('node-spotify-api');
                console.log(keys.client); 
                console.log(keys.secret); 

                
                var spot = new Spotify({
                  id: keys.client,
                  secret: keys.secret
                });
                 
                spot.search({ query: songName }, function(err, data) {
                  if (err) {
                    return console.log('Error occurred: ' + err);
                  }
                 
                console.log(data); 

    })
    
},
    'movie-this':function(movieName){
        // * This will output the following information to your terminal/bash window:

        // ```
        //   * Title of the movie.
        //   * Year the movie came out.
        //   * IMDB Rating of the movie.
        //   * Rotten Tomatoes Rating of the movie.
        //   * Country where the movie was produced.
        //   * Language of the movie.
        //   * Plot of the movie.
        //   * Actors in the movie.
        // ```* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

        //  * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>

        //  * It's on Netflix!

        

    },
    'do-what-it-says':function(){

        const filesystem = require('fs')



    }
}

    validCommands[command](argument)


function make_api_call(_endpoint, _promiss){

    const axios = require('axios')
    
    axios.get(_endpoint).then(function(response){

        _promiss(response)

    })
}
