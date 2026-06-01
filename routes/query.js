const express = require("express");
const router = express.Router();

const pineconeIndex =
  require("../db/pinecone");

router.get("/", async (req, res) => {

  try {

    const results =
      await pineconeIndex.query({
        vector: Array.from(
          { length: 768 },
          () => Math.random()
        ),

        topK: 3,

        includeMetadata: true
      });

    res.json(results);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;