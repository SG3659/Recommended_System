import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

const embeddings = new VoyageEmbeddings({
  apiKey: "process.env.NEXT_PUBLIC_API_KEY", // In Node.js defaults to process.env.VOYAGEAI_API_KEY
  inputType: "query", // Optional: specify input type as 'query', 'document', or omit for None / Undefined / Null
});

// this function  covert the string in embedding
export const embed = async (text: string) => {
  try {
    if (!text) {
      throw new Error("Text input is required for embedding");
    }
    console.log("Embedding text:", text); // Add logging here
    const embedding = await embeddings.embedQuery(text);
    return embedding;
  } catch (error) {
    console.error("Error in embed function:", error);
    throw error;
  }
};

