const {
  ChatGoogleGenerativeAI
} = require(
  "@langchain/google-genai"
);

const model =
  new ChatGoogleGenerativeAI({

    apiKey:
      process.env.GEMINI_API_KEY,

    model:
      "gemini-2.5-flash",

    temperature: 0

  });

async function askLLM(
  prompt
) {

  return await model.stream(
    prompt
  );

}

module.exports = {
  askLLM
};