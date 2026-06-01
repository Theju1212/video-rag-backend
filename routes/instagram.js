const express =
  require("express");

const router =
  express.Router();

const {
  getReelData
} = require(
  "../services/instagramService"
);

router.get(
  "/",
  async (req, res) => {

    try {

      const reelUrl =
        req.query.url;

      const data =
        await getReelData(
          reelUrl
        );

      res.json({
        success: true,
        data
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