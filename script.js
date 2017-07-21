let x2js = new X2JS();

let jsonSubtitles = [];

let fetchVideo = function(videoID, language) {
  return $.get("http://video.google.com/timedtext?lang=:language&v=:videoid"
    .replace(":language", language).replace(":videoid", videoID), 
    {}, function (data) {
        // Success. Transform the xml to json.
        let json = x2js.xml_str2json(data);
        jsonSubtitles.push(json);
        console.log(jsonSubtitles);
      }, "text")
};

let fetchAllVideos = function () {
  $(".status")[0].innerHTML = "";
  $(".message")[0].innerHTML = "";
  let channel = $("#channelID").val();
  let key = $("#apiKEY").val();
  if (key) {
    if (channel) {
      console.log("fetching videos from ", channel);
      let pageToken = "";
      let videos = [];
      let videosF = [];
      let totalResults = 0;
      let totalCount = 0;

      let f = function (token) {
        requestUrl = "https://www.googleapis.com/youtube/v3/search?pageToken=:page_token&order=date&part=snippet&channelId=:channel_id&maxResults=50&key=:api_key"
          .replace(":channel_id", channel).replace(":api_key", key).replace(":page_token", token);

        $.get(requestUrl, {}, function (data) {
          console.log(data);
          pageToken = data.nextPageToken;
          videos.push(data.items.map(function (video) {
            return video.id.videoId;
          }));
          console.log(videos);
          totalResults = data.pageInfo.totalResults;
          totalCount += data.items.length;

          // Report data received
          $(".status")[0].innerHTML = "progress: " + Math.ceil((totalCount * 100) / totalResults) + "%" 
            + " (" + totalCount + "/" + totalResults + ")";

          if (totalCount < totalResults && pageToken) {
            f(pageToken);
          } else {
            if (totalCount < totalResults) $(".message")[0].innerHTML = "finished... although not completely";

            // Gets the subtitles for every video that we received;
            videos.forEach(function (pack) {
              pack.forEach(function (video) {
                fetchVideo(video, "en");
              })
            });
          }
        });
      }

      f(pageToken);
    } else {
      console.error("NO CHANNEL ID?");
    }
  } else {
    console.error("NO KEY!!!");
  }
};