require("dotenv").config();

const { RecursiveCharacterTextSplitter } =
  require("@langchain/textsplitters");

async function chunkTranscript(transcript) {

  const fullText = transcript
    .map(item => item.text)
    .join(" ");

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

  const chunks =
    await splitter.createDocuments([fullText]);

  return chunks;
}

module.exports = {
  chunkTranscript,
};