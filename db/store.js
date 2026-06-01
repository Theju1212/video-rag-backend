let storedData = {
  metadata: null,
  chunks: [],
};

function saveData(data) {
  storedData = data;
}

function getData() {
  return storedData;
}

function getChunkByIndex(index) {
  return storedData.chunks[index];
}


function searchChunks(question) {

  const words =
    question
      .toLowerCase()
      .split(" ");

  return storedData.chunks.filter(chunk => {

    const text =
      chunk.pageContent.toLowerCase();

    return words.some(word =>
      text.includes(word)
    );

  });

}


module.exports = {
  saveData,
  getData,
  getChunkByIndex,
  searchChunks,
};