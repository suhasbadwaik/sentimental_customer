import axios from "axios";
import "dotenv/config";

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

export async function getSentiment(text) {
  const { data } = await axios.post(
    `${PYTHON_URL}/analyze`,
    { text },
    { timeout: 5000 }
  );
  return data; // { label, compound, scores }
}