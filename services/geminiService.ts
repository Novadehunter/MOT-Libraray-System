
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available. In a real app, this would be handled securely.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'The title of the book.',
        },
        author: {
          type: Type.STRING,
          description: 'The name of the author.',
        },
        publisher: {
            type: Type.STRING,
            description: 'The publisher of the book.',
        },
        category: {
            type: Type.STRING,
            description: 'The book\'s category, such as Logistics, Urban Planning, Engineering, or Policy.',
        },
        year: {
            type: Type.INTEGER,
            description: 'The year the book was published.',
        },
        shelfNo: {
            type: Type.STRING,
            description: 'A fictional shelf number, e.g., A1-01.'
        },
        isbn: {
            type: Type.STRING,
            description: 'The ISBN of the book.'
        },
        quantity: {
            type: Type.INTEGER,
            description: 'The total number of copies for this book, e.g., between 1 and 10.',
        },
      },
      required: ["title", "author", "publisher", "category", "year", "shelfNo", "isbn", "quantity"],
    },
};

export const generateSampleBooks = async (count: number) => {
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const prompt = `Generate a list of ${count} realistic, fictional book titles suitable for a Ministry of Transport library. The topics should revolve around transportation, logistics, urban planning, and civil engineering. Also include a realistic quantity for each book. Provide the response as a JSON array.`;
  
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const generatedBooks = JSON.parse(jsonText);
        
        // Basic validation
        if (!Array.isArray(generatedBooks)) {
            throw new Error("API did not return a valid array.");
        }
        
        return generatedBooks;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate book data from Gemini API.");
    }
};