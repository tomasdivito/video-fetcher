### VIDEO FETCHER

Although this repo should be more like, Subtitle fetcher.

Basically what we do here is.

- Get all the videos from a channel.

- Get all the subtitles from the videos in xml

- Parse them all in json

- Create objects with lines from the videos and data from the line and the video

All to create a twitter bot.

**TODO:**
- Fix fetching videos doesn't get 100% of the videos (I read something about using playlists being better to fetch more videos)

- Code looks like s... 

So far if it could only get 100% videos it will work.

It will only save videos which have (in this case english) subtitles. Not generated automatically.

You will also need a html file to use this that can be just like this and this project **should** work.

```
<html> 
  <head>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h3>video fetcher</h3>

      <label for="channel">CHANNEL ID:</label>
      <input class="form-control" type="text" name="channel" id="channelID">
      <label for="key">V3 API-KEY:</label>
      <input class="form-control" type="text" name="key" id="apiKEY">
      <button class="btn btn-success" onclick="fetchAllVideos()">fetch videos</button>

      <div class="status"></div>

      <div class="message"></div>

      <div id="download"></div>
    </div>

    <!-- scripts imports stuff !-->
    <script src="vendor/jquery-3.2.1.js"></script>
    <script src="vendor/xml2json.js"></script>
    <script src="script.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>
```