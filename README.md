# Soundora

Soundora is an AnuglarJS application using Soundclouds backend to create a Pandora "clone".
The idea was to create a Pandora application for indie artists, but Soundcloud is big enough now that it is
still overrun by major artists and labels.

Once connecting with Soundcloud, the app allows you to search for a user and create a station similar to that users music taste.
This works by pulling the users latest song, and building out next tracks based on the genre of that song. There's a limitation of what I can do but I plan to improve this as Soundcloud releases their API v2.

If a track doesn't play it's because of something on the API's end (some tracks don't allow
streaming off the API) and I haven't implemented error handling for that yet.

There are a lot of limitations of the Soundcloud API, but an api-v2 is in works and hopefully brings a
lot more use to update this application. (Such as recommended tracks. Which are part of the next API,
which Soundcloud currently uses but wont allow third parties to use.)

Enjoy!

## Setup

1. Install Node.JS and NPM
2. Terminal > "npm install 0.10.33"
3. "sudo npm install -g bower"
4. "npm start" and the server is up.

###Optional:
1. "npm run update-webdriver" for end to end testing.
2. "npm run protractor"
3. "npm run update-index-async" - Run after updating angular.

## Todo:
1. Add error handling for tracks that won't load resources properly.
2. Thumbs down is fake. How could we manage/store thumbs downed tracks?
3. Simple, but add math to the setTrack function to pull a random song from the user and not just their latest. Crucial!!
4. More track info is saved in scope. Use that to share/link to tracks.

```
http-server -a localhost -p 8000
```
