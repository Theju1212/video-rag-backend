const { HfInference } =
  require("@huggingface/inference");

const hf =
  new HfInference(
    process.env.HUGGINGFACE_API_KEY
  );

async function getEmbedding(text) {

  const embedding =
    await hf.featureExtraction({
      model:
        "sentence-transformers/all-MiniLM-L6-v2",

      inputs: text,
    });

  console.log(
    "EMBEDDING LENGTH:",
    embedding.length
  );

  return embedding;
}

module.exports = {
  getEmbedding,
};