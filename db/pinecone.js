const { Pinecone } =
  require("@pinecone-database/pinecone");

const pinecone =
  new Pinecone({
    apiKey:
      process.env.PINECONE_API_KEY,
  });

const index =
  pinecone.index(
    "video-comparison-rag-v2"
  );

module.exports = index;