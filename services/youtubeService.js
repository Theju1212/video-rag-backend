const { YoutubeTranscript } = require("youtube-transcript");
const { Innertube } = require("youtubei.js");
const calculateEngagement =
  require("../utils/engagement");

async function getTranscript(videoId) {
  try {
    const transcript =
      await YoutubeTranscript.fetchTranscript(videoId);

    return transcript;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function extractVideoId(url) {

  try {

    const parsedUrl =
      new URL(url);

    if (
      parsedUrl.hostname.includes(
        "youtu.be"
      )
    ) {
      return parsedUrl.pathname
        .substring(1);
    }

    return parsedUrl.searchParams.get(
      "v"
    );

  } catch (error) {

    return null;

  }

}





async function getVideoMetadata(videoId) {

  try {

    const youtube =
      await Innertube.create();

    const info =
      await youtube.getInfo(videoId);



return {

  title:
    info.basic_info.title,

  channel:
    info.basic_info.author,

  views:
    info.basic_info.view_count || 0,

  likes:
    info.basic_info.like_count || 0,

  duration:
    info.basic_info.duration || 0,

  hashtags:
    info.basic_info.keywords || [],

    uploadDate:
  info.primary_info
    ?.published
    ?.text || "Unknown",

  engagementRate:
    calculateEngagement(
      info.basic_info.like_count || 0,
      0,
      info.basic_info.view_count || 0
    )

};


  } catch (error) {

    console.log(error);
    throw error;

  }

}


module.exports = {
  getTranscript,
  extractVideoId,
  getVideoMetadata,
};