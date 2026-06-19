let vectorStore = null;

function setVectorStore(store) {
  vectorStore = store;
}

function getVectorStore() {
  return vectorStore;
}

module.exports = { setVectorStore, getVectorStore };