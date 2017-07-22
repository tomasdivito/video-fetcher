let x2js = new X2JS();
let zip = new JSZip();

let jsonSubtitles = [];
let promises = [];

let fetchVideo = function(videoID, language) {
  let promise = $.Deferred();
  $.get("http://video.google.com/timedtext?lang=:language&v=:videoid"
    .replace(":language", language).replace(":videoid", videoID), 
    {}, function (data) { 
      let xml = data;
      data = {
        xml: xml,
        video: videoID,
      }
      promise.resolve(data) 
    }, "text");
  
  return promise;
};

let generateJsonWithLines = function (data) {
  $(".message")[0].innerHTML = "Generating JSON. Downloading when ready.";
  data.forEach(function (d) {
    if (d.json) {
      d.json.transcript.text.forEach(function(l) {
        jsonSubtitles.push({
          video: d.video,
          text: l.__text,
          time: Number(l._start),
        });
      });
    }
  });
  
  var data = JSON.stringify(jsonSubtitles);
  let binaryData = [];
  binaryData.push(data);
  let url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
  console.log(url);
  let a = document.createElement("a");
  a.href = url;
  a.download = "lines.json";
  let container = document.getElementById("download");
  container.appendChild(a);
  a.click();
  a.remove();
};

let transformData = function (...data) {
  data.forEach(function (d) {
    d.json = x2js.xml_str2json(d.xml);
  });

  generateJsonWithLines(data);
};

let fetchAllVideos = () => {
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
          pageToken = data.nextPageToken;
          videos.push(data.items.map(function (video) {
            return video.id.videoId;
          }));
          totalResults = data.pageInfo.totalResults;
          totalCount += data.items.length;

          // Report data received
          $(".status")[0].innerHTML = "progress: " + Math.ceil((totalCount * 100) / totalResults) + "%" 
            + " (" + totalCount + "/" + totalResults + ")";

          if (totalCount <= totalResults && pageToken) {
            f(pageToken);
          } else {
            if (totalCount < totalResults) $(".message")[0].innerHTML = "Done... but not all videos fetched :(";

            // Gets the subtitles for every video that we received;
            videos.forEach(function (pack) {
              pack.forEach(function (video) {
                if (video) {
                  promises.push(fetchVideo(video, "en"));
                }
              })
            });

            $.when(...promises).done(transformData);
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