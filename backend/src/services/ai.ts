import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseNaturalLanguageToRules(query: string) {
  try {
    const prompt = `Convert the following natural language query into a structured rule format for customer segmentation:
    Query: "${query}"
    
    Return the response in the following JSON format:
    {
      "combinator": "and" | "or",
      "rules": [
        {
          "field": string,
          "operator": string,
          "value": string | number
        }
      ]
    }
    
    Available fields:
    - total_spent (number)
    - last_active (date)
    - visit_count (number)
    - order_count (number)
    - days_since_last_order (number)
    
    Available operators:
    - =, !=, <, >, <=, >=
    - contains, beginsWith, endsWith (for text fields)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that converts natural language queries into structured rules for customer segmentation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || '{}');
  } catch (error) {
    console.error('Failed to parse natural language to rules:', error);
    throw error;
  }
}

export async function generateCampaignInsights(campaignStats: any) {
  try {
    const prompt = `Generate human-readable insights for the following campaign statistics:
    ${JSON.stringify(campaignStats, null, 2)}
    
    Focus on:
    1. Overall performance
    2. Success/failure patterns
    3. Notable trends
    4. Recommendations for improvement
    
    Keep the response concise and actionable.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a marketing analytics expert that provides clear, actionable insights from campaign data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Failed to generate campaign insights:', error);
    throw error;
  }
}

export async function suggestMessageVariants(campaignObjective: string, audienceDescription: string) {
  try {
    const prompt = `Generate 3 message variants for a campaign with the following objective and audience:
    Objective: ${campaignObjective}
    Audience: ${audienceDescription}
    
    Return the response in the following JSON format:
    {
      "variants": [
        {
          "message": string,
          "tone": string,
          "rationale": string
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a marketing copywriter that creates engaging, personalized messages for different customer segments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || '{"variants": []}');
  } catch (error) {
    console.error('Failed to suggest message variants:', error);
    throw error;
  }
} 