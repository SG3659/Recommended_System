import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

const embeddings = new VoyageEmbeddings({
  apiKey: "process.env.NEXT_PUBLIC_API_KEY", // In Node.js defaults to process.env.VOYAGEAI_API_KEY
  inputType: "query", // Optional: specify input type as 'query', 'document', or omit for None / Undefined / Null
});

// this function  covert the string in embedding
export const embed = async (text: string) => {
  const embedding = await embeddings.embedQuery(text);
  return embedding;
};

