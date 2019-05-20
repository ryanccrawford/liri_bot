# Liri Bot

Liri Bot is a Node JS command line application

  - Combines data avaliable from 3 different APIs 
  - The API's used are 
    - Spotify.com
    - bandsintown.com
    - omdbapi.com

# Features & Usage

  - use --help to list avaliable commands
  - Use one of the fallowing commands 
        concert-this <artist name>
        spotify-this-song <artist name>
        movie-this <movie Name>
        do-what-it-says 

Each command will return small amounts of data from the API it is associated with. 

Usage:
You must first create a .evn file with your API keys like this. Save it to the document root. 
```
#API KEYS
BANDS_IN_TOWN=<api key here>
SPOTIFY_ID=<api id here>
SPOTIFY_SECRET=<api seceret here>
SPOTIFY_TOKEN=<api token here>
OMDB_KEY=<api key here>
```
Then run npm i, this will install all the node packages that are required

```nodejs
$ npm i
```
Then when ready run the application on the command line like this
```nodejs
$ node liri.js <command> <arguments ...>
```

You can also make plain txt file call it rasndom.txt and save a comma seperated command list like this
```txt
spotify-this-song,"I Want it That Way"
movie-this,Gone in 60 Seconds
```
then run
```nodejs
$ node liri.js do-what-it-says
```
this will process all the commands at once, reading each line form your txt file.

Thanks for looking

