const express = require("express");
const router = express.Router();

const {
  getTranscript,
  extractVideoId,
  getVideoMetadata,
} = require("../services/youtubeService");

const chromaClient =
  require("../db/chroma");

const {
  chunkTranscript,
} = require("../services/ragService");

const {
  saveData,
  getData,
} = require("../db/store");


const pineconeIndex =
  require("../db/pinecone");


  const {
  getEmbedding
} = require(
  "../services/embeddingService"
);

console.log("ANALYZE ROUTE HIT");

router.get("/", async (req, res) => {
    console.log("YOUTUBE ROUTE HIT");
  try {

    const youtubeUrl =
      req.query.url;

    if (!youtubeUrl) {

  return res.status(400).json({
    success: false,
    error: "YouTube URL missing"
  });

}

    const videoId =
      extractVideoId(youtubeUrl);

    if (!videoId) {

  return res.status(400).json({
    success: false,
    error: "Invalid YouTube URL"
  });

}
   
    const metadata =
      await getVideoMetadata(videoId);
      console.log("METADATA:", metadata);
    
 console.log("METADATA:", metadata);

    let transcript = [];

try {

  transcript =
    await getTranscript(
      videoId
    );

} catch (error) {

  console.log(
    "Transcript blocked"
  );

  transcript = [
    {
      text:
        metadata.title +
        " " +
        metadata.hashtags.join(" ")
    }
  ];

}

    const firstHook =
  transcript
    .slice(0, 5)
    .map(
      item => item.text
    )
    .join(" ");

    const chunks =
      await chunkTranscript(transcript);

    const chunksWithIds =
      chunks.map((chunk, index) => ({
        id: index + 1,
        pageContent: chunk.pageContent,
      }));

    saveData({
  metadata,
  chunks: chunksWithIds,
});





const vectors = [];

for (const chunk of chunksWithIds) {

  const embedding =
    await getEmbedding(
      chunk.pageContent
    );

  vectors.push({
  id: `youtube-${chunk.id}`,

  values: embedding,

 metadata: {
  videoId: "A",

  source: "youtube",

  text: chunk.pageContent,

  title: metadata.title,

  creator: metadata.channel,

  views: metadata.views,

  likes: metadata.likes,

  hashtags: metadata.hashtags,

  duration: metadata.duration,

  engagementRate:
    metadata.engagementRate,

  uploadDate:
  metadata.uploadDate,

  hook: firstHook
},
});

}




await pineconeIndex.upsert({
  records: vectors
});

    res.json({
      success: true,

      metadata,

      totalChunks:
        chunks.length,

      sampleChunk:
        chunks[0].pageContent,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
});

router.get("/stored-chunks", (req, res) => {

  const data =
    getData();

  res.json({
    metadata:
      data.metadata,

    totalChunks:
      data.chunks.length,
  });

});

router.get("/chroma-test", async (req, res) => {

  try {

    const collections =
      await chromaClient.listCollections();

    res.json({
      success: true,
      collections,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});



router.get("/pinecone-test", async (req, res) => {

  try {

    const stats =
      await pineconeIndex.describeIndexStats();

    res.json({
      success: true,
      stats,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

router.get("/pinecone-upsert-test", async (req, res) => {

  try {

    const record = {
      id: "test1",
      values: Array.from(
        { length: 768 },
        () => Math.random()
      ),
    };

    console.log(record);

    await pineconeIndex.upsert({
      records: [record]
    });

    console.log("UPSERT SUCCESS");

    res.json({
      success: true
    });

  } catch (error) {

    console.log(
      "PINECONE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

router.get("/embedding-test", async (req, res) => {

  const embedding =
    await getEmbedding("hello world");

  res.json({
    length: embedding.length
  });

});


module.exports = router;