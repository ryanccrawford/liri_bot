require("dotenv").config()
const Keys = require("./keys.js")
const Moment = require("moment")
const spotify = require("node-spotify-api")

var command = process.argv[2]
var argument = process.argv.slice(3).join(" ")

//Valid Commands Object to use check input command exist if so call the method with the same name. Arguments are passed as arguments
var validCommands = function () {
    return {
        checkCommand: function (_commmand) {
            for (var command in this) {
                if (command === _commmand) {
                    return true
                }         
            }
            return false
        },
        'concert-this': function (artist) {

            var encoded = encodeURIComponent(artist)
            var end_point = `https://rest.bandsintown.com/artists/${encoded}/events?app_id=codingbootcamp`
            make_api_call(end_point, function (data) {
                var status = data.status
                if (status !== 200) {
                    return
                }
                if (status === 200) {
                    var info = data.data
                    if (info.length > 0) {
                        info.forEach(element => {
                            var dateofEvent = element.datetime
                            var formatedDate = Moment(dateofEvent).format("MM/DD/YYYY")
                            console.log(`Date: ${formatedDate}\nArtist: ${artist}\nVenue:\n${element.venue.name}\n${element.venue.city}, ${element.venue.region}`)
                        });
                    }
                }
            })
        },
        'spotify-this-song': function (songName) {
            //         * This will show the following information about the song in your terminal/bash window

            //      * Artist(s)

            //      * The song's name

            //      * A preview link of the song from Spotify

            //      * The album that the song is from

            //    * If no song is provided then your program will default to "The Sign" by Ace of Base.

          

            var spotifyApi = new spotify({
                id: Keys.spotify.id,
                secret: Keys.spotify.secret
            })
            spotifyApi.setToken(Keys.spotify.token);
            var searchObject = {}
            if (!songName) {
                songName = "The Sign"
                var artist = "Ace of Base"
                //q=album:gold%20artist:abba&type=album
                searchObject.type = "track"
                searchObject.query = `track:"${songName}" artist:"${artist}"`
               
            } else {
                searchObject.type = "track"
                searchObject.query = `"${songName}"`
            }
            
            spotifyApi.search(searchObject)
                .then(function (data) {
                    var tracks = data.tracks.items[0]
                    var artist = function () {
                        tracks.artists.forEach(artist => {
                            console.log(`Artist Name: ${artist.name}`)
                        })
                    }
                    artist()
                    console.log(`Track Name: ${tracks.name}`)
                    console.log(`Album Name: ${tracks.album.name}`)
                    console.log(`Preview Url: ${tracks.preview_url}`)

                }, function (err) {
                    console.error(`Erorr: ${err}`);
                });
            
        },
        'movie-this': function (movieName) {
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
        'do-what-it-says': function () {

            const filesystem = require('fs')



        }
    }
}

if (command === "--help") {
    console.log(`You can use:`)
    for (var key in validCommands.Keys) {
        console.log(`${key}`)
        process.exit(0)
    }
} else
{
    var commands = new validCommands()
    if (!commands.checkCommand(command)) {
        console.log(`${command} is not a valid command. For help use --help`)
        process.exit(0)
    } else {
        commands[command](argument)
    }
}


function make_api_call(_endpoint, _promiss) {

    const axios = require('axios')

    axios.get(_endpoint).then(function (response) {

        _promiss(response)

    })
}
function showTracksData(_responseData) {
    var tracks = _responseData.tracks
    for (var track in tracks) {
        if (Array.isArray(tracks[track])) {
            console.log(`${track}:`)
            tracks[track].forEach(element => { 
                if (typeof (element) === "object") {
                    for (var item in element) {
                        console.log(`${item} - ${element[item]}`)
                    }
                }
                console.log(`${element}`)
            })
        }
        console.log(`${track}: ${tracks[track]}`)
    }

}