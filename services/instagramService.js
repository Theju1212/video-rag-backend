const {
  instagramGetUrl
} = require(
  "instagram-url-direct"
);

const calculateEngagement =
  require("../utils/engagement");

async function getReelData(reelUrl) {

  try {

    const data =
      await instagramGetUrl(
        reelUrl
      );


    const caption =
      data.post_info?.caption || "";

    const hashtags =
      caption.match(
        /#\w+/g
      ) || [];

   return {

  creator:
    data.post_info?.owner_username,

  caption,

  hashtags,

  views:
    data.media_details?.[0]
      ?.video_view_count || 0,

  likes:
    data.post_info?.likes || 0,

  engagementRate:
    calculateEngagement(
      data.post_info?.likes || 0,
      0,
      data.media_details?.[0]
        ?.video_view_count || 0
    ),

  videoUrl:
    data.url_list?.[0]

};
  } catch (error) {

    console.log(error);
    throw error;

  }

}

module.exports = {
  getReelData
};