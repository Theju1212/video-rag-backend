const express = require("express");
const router = express.Router();

const chatHistory = [];

const pineconeIndex =
  require("../db/pinecone");

const {
  getEmbedding
} = require(
  "../services/embeddingService"
);


const {
  askLLM
} = require(
  "../langchain/ragChain"
);


router.post("/", async (req, res) => {

  try {

    const { question } =
      req.body;

    const questionEmbedding =
      await getEmbedding(
        question
      );

    const results =
      await pineconeIndex.query({
        vector:
          questionEmbedding,

        topK:  100,

        includeMetadata: true,
      });

    const videoAChunks =
      results.matches.filter(
        match =>
          match.metadata?.videoId === "A"
      );

    const videoBChunks =
      results.matches.filter(
        match =>
          match.metadata?.videoId === "B"
      );

    const videoAMetadata =
      videoAChunks[0]?.metadata;

    const videoBMetadata =
      videoBChunks[0]?.metadata;


      const videoAHook =
  videoAMetadata?.hook ||
  "Not available";

const videoBHook =
  videoBMetadata?.hook ||
  "Not available";


    const contextA =
      videoAChunks
        .slice(0, 5)
        .map(
          match =>
            match.metadata?.text || ""
        )
        .join("\n\n");

    const contextB =
      videoBChunks
        .slice(0, 5)
        .map(
          match =>
            match.metadata?.text || ""
        )
        .join("\n\n");

    const historyContext =
      chatHistory
        .map(
          chat =>
            `Q: ${chat.question}
A: ${chat.answer}`
        )
        .join("\n\n");

  const prompt = `
Previous Conversation:

${historyContext}

--------------------------------

Video A Metadata

Title:
${videoAMetadata?.title}

Creator:
${videoAMetadata?.creator}

Views:
${videoAMetadata?.views}

Likes:
${videoAMetadata?.likes}

Duration:
${videoAMetadata?.duration}

Hashtags:
${JSON.stringify(
  videoAMetadata?.hashtags
)}

Engagement Rate:
${videoAMetadata?.engagementRate}

Upload Date:
${videoAMetadata?.uploadDate}

Hook:
${videoAHook}

--------------------------------

Video A Content

${contextA}

--------------------------------

Video B Metadata

Title:
${videoBMetadata?.title}

Creator:
${videoBMetadata?.creator}

Views:
${videoBMetadata?.views}

Likes:
${videoBMetadata?.likes}

Hashtags:
${JSON.stringify(
  videoBMetadata?.hashtags
)}

Engagement Rate:
${videoBMetadata?.engagementRate}

Hook:
${videoBHook}

--------------------------------

Video B Content

${contextB}

--------------------------------

Question:
${question}

Answer ONLY using the metadata
and retrieved content above.

If asked about hooks:
Use the Hook fields.

If asked about engagement:
Use Engagement Rate fields.

If asked about hashtags:
Use Hashtags fields.

If asked to compare videos:
Compare metadata and content together.
`;

res.setHeader(
  "Content-Type",
  "text/event-stream"
);

res.setHeader(
  "Cache-Control",
  "no-cache"
);

res.setHeader(
  "Connection",
  "keep-alive"
);

const stream =
  await askLLM(
    prompt
  );

let answer = "";

for await (
  const chunk of stream
) {
  console.log(
  "STREAM CHUNK:",
  chunk.content
);

  const text =
    chunk.content || "";

  answer += text;

  res.write(
    `data: ${JSON.stringify({
      text
    })}\n\n`
  );

}

chatHistory.push({
  question,
  answer
});

res.write(
  `data: ${JSON.stringify({
    done: true,

    sources: [

      ...videoAChunks.map(
        (_, index) =>
          `Video A Chunk ${index + 1}`
      ),

      ...videoBChunks.map(
        (_, index) =>
          `Video B Chunk ${index + 1}`
      )

    ]
  })}\n\n`
);

res.end();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error:
        error.message
    });

  }

});

module.exports = router;