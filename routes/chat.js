const express = require("express");
const router = express.Router();

const pineconeIndex =
  require("../db/pinecone");

const {
  getEmbedding
} = require(
  "../services/embeddingService"
);

const { GoogleGenerativeAI } =
  require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

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

        topK: 3,

        includeMetadata: true,
      });

    if (
      !results.matches ||
      results.matches.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error:
          "No relevant chunks found",
      });
    }

    console.log(
      "MATCHES:",
      results.matches.length
    );

    console.log(
      "FIRST MATCH FULL:"
    );

    console.log(
      JSON.stringify(
        results.matches[0],
        null,
        2
      )
    );

    const firstMatch =
      results.matches[0];

    console.log(
      "METADATA:"
    );

    console.log(
      firstMatch.metadata
    );

    const title =
      firstMatch.metadata?.title ||
      "Unknown";

    const creator =
      firstMatch.metadata?.creator ||
      "Unknown";

    const source =
      firstMatch.metadata?.source ||
      "Unknown";

    console.log(
      "TITLE:",
      title
    );

    console.log(
      "CREATOR:",
      creator
    );

    console.log(
      "SOURCE:",
      source
    );

    const relevantChunks =
      results.matches.map(
        (match, index) => ({
          id: index + 1,

          pageContent:
            match.metadata?.text ||
            ""
        })
      );

    const context =
      relevantChunks
        .map(
          chunk =>
            chunk.pageContent
        )
        .join("\n\n");

    const prompt = `
Source:
${source}

Title:
${title}

Creator:
${creator}

Relevant Content:

${context}

Question:
${question}

Answer ONLY using the content above.
`;

    const result =
      await model.generateContent(
        prompt
      );

    const answer =
      result.response.text();

    res.json({
      success: true,

      answer,

      source,

      title,

      creator,

      sources: relevantChunks.map(
        chunk =>
          `Chunk ${chunk.id}`
      ),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

module.exports = router;