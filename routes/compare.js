const express =
  require("express");

const router =
  express.Router();

const {
  extractVideoId,
  getVideoMetadata
} = require(
  "../services/youtubeService"
);

const {
  getReelData
} = require(
  "../services/instagramService"
);

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        youtubeUrl,
        instagramUrl
      } = req.body;

      const videoId =
        extractVideoId(
          youtubeUrl
        );

      const youtubeData =
        await getVideoMetadata(
          videoId
        );

      const instagramData =
        await getReelData(
          instagramUrl
        );

      res.json({

        success: true,

        youtube: {

          title:
            youtubeData.title,

          creator:
            youtubeData.channel,

          views:
            youtubeData.views

        },

        instagram: {

          creator:
            instagramData.creator,

          views:
            instagramData.views

        }

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        error:
          error.message
      });

    }

  }
);

module.exports =
  router;