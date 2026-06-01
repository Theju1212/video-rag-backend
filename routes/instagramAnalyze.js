const express = require("express");
const router = express.Router();

const {
  getReelData
} = require(
  "../services/instagramService"
);

const {
  getEmbedding
} = require(
  "../services/embeddingService"
);

const {
  chunkTranscript
} = require(
  "../services/ragService"
);

const pineconeIndex =
  require("../db/pinecone");

router.get(
  "/",
  async (req, res) => {

    try {

      const reelUrl =
        req.query.url;

      console.log(
        "INSTAGRAM URL:",
        reelUrl
      );

      if (!reelUrl) {

        return res.status(400).json({
          success: false,
          error:
            "Instagram URL missing"
        });

      }

      const reelData =
        await getReelData(
          reelUrl
        );

      const firstHook =
  reelData.caption
    ?.split(" ")
    .slice(0, 25)
    .join(" ");

      const transcript = [
        {
          text:
            reelData.caption ||
            "No caption available"
        }
      ];

      const chunks =
        await chunkTranscript(
          transcript
        );

      const vectors = [];

      for (
        let i = 0;
        i < chunks.length;
        i++
      ) {

        const embedding =
          await getEmbedding(
            chunks[i].pageContent
          );

        vectors.push({

          id:
            `instagram-${i + 1}-${Date.now()}`,

          values:
            embedding,

            metadata: {

  videoId: "B",

  source: "instagram",

  title:
    reelData.caption
      ? reelData.caption.substring(
          0,
          60
        )
      : "Instagram Reel",

  creator:
    reelData.creator,

  views:
    reelData.views,

  likes:
    reelData.likes,

  hashtags:
    reelData.hashtags,

  duration:
    reelData.duration || 0,

  engagementRate:
    reelData.engagementRate,

  hook:
    firstHook,

  text:
    chunks[i].pageContent

}
        });

      }



      await pineconeIndex.upsert({
        records:
          vectors
      });

      res.json({

        success: true,

        totalChunks:
          chunks.length,

        reelData

      });

    } catch (error) {

      console.log(
        "INSTAGRAM ERROR:"
      );

      console.log(error);

      res.status(500).json({

        success: false,

        error:
          error.message

      });

    }

  }
);

module.exports = router;