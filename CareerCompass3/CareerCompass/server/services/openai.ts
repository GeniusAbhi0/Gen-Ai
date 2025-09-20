import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface CareerAnalysisResult {
  strengths: string[];
  careerOpportunities: Array<{
    title: string;
    match: number;
    description: string;
    demand: string;
  }>;
  skillsToLearn: Array<{
    skill: string;
    priority: "High" | "Medium" | "Low";
    relevance: number;
  }>;
  learningRoadmap: Array<{
    phase: string;
    duration: string;
    title: string;
    description: string;
    resources: string[];
  }>;
}

export async function analyzeStudentProfile(profile: any): Promise<CareerAnalysisResult> {
  const prompt = `You are CareerCompass, an AI career advisor. Analyze this student profile and provide personalized career guidance.

Student Profile:
- Name: ${profile.fullName}
- Age: ${profile.age}
- Education: ${profile.educationLevel}
- Field of Study: ${profile.fieldOfStudy || "Not specified"}
- Interests: ${profile.interests?.join(", ") || "Not specified"}
- Skills: ${profile.skills || "Not specified"}
- Hobbies: ${profile.hobbies || "Not specified"}
- Career Goals: ${profile.careerGoals || "Not specified"}
- Work Style: ${profile.workStyle || "Not specified"}
- Areas to Improve: ${profile.improvementAreas || "Not specified"}

Provide a comprehensive analysis with:
1. Key strengths (4-6 items)
2. Career opportunities (3-4 specific roles with match percentage, description, and market demand)
3. Skills to learn (3-4 skills with priority level and relevance percentage)
4. 6-month learning roadmap (3 phases with duration, resources)

Respond in JSON format matching this structure:
{
  "strengths": ["strength1", "strength2", ...],
  "careerOpportunities": [
    {
      "title": "Job Title",
      "match": 95,
      "description": "Brief description",
      "demand": "High demand" | "Growing field" | "Stable market"
    }
  ],
  "skillsToLearn": [
    {
      "skill": "Skill Name",
      "priority": "High" | "Medium" | "Low",
      "relevance": 90
    }
  ],
  "learningRoadmap": [
    {
      "phase": "1",
      "duration": "Month 1-2",
      "title": "Phase Title",
      "description": "What to focus on",
      "resources": ["Resource 1", "Resource 2"]
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are CareerCompass, a friendly AI career mentor. Provide structured, actionable career guidance in JSON format. Be encouraging and specific."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as CareerAnalysisResult;
  } catch (error) {
    console.error("Error analyzing student profile:", error);
    throw new Error("Failed to analyze student profile. Please try again.");
  }
}

export async function getChatResponse(message: string, profile?: any): Promise<string> {
  const systemMessage = `You are CareerCompass, an AI-powered career mentor. You help students discover their interests, strengths, and career opportunities.

Your communication style:
- Friendly, modern, and motivating like a mentor
- Use structured answers with emojis (✅ Your strengths, 📘 Suggested skills, 🚀 Career opportunities)
- Provide actionable, specific advice
- Never give generic responses - always personalize
- Keep responses concise but insightful

${profile ? `
Student Context:
- Name: ${profile.fullName}
- Education: ${profile.educationLevel}
- Interests: ${profile.interests?.join(", ") || "Not specified"}
- Skills: ${profile.skills || "Not specified"}
- Goals: ${profile.careerGoals || "Not specified"}
` : ""}

Always provide helpful, encouraging, and practical career advice.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Failed to get response from AI mentor. Please try again.");
  }
}
