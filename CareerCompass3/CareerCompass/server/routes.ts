import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentProfileSchema, insertConversationSchema, insertCareerAnalysisSchema } from "@shared/schema";
import { analyzeStudentProfile, getChatResponse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student Profile Routes
  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertStudentProfileSchema.parse(req.body);
      const profile = await storage.createStudentProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: error.message || "Failed to create profile" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getStudentProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Career Analysis Routes
  app.post("/api/career-analysis", async (req, res) => {
    try {
      const { profileId } = req.body;
      
      if (!profileId) {
        return res.status(400).json({ message: "Profile ID is required" });
      }

      const profile = await storage.getStudentProfile(profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Check if analysis already exists
      const existingAnalysis = await storage.getCareerAnalysisByProfileId(profileId);
      if (existingAnalysis) {
        return res.json(existingAnalysis);
      }

      // Generate new analysis using OpenAI
      const analysisResult = await analyzeStudentProfile(profile);
      
      const analysisData = {
        profileId,
        strengths: analysisResult.strengths,
        careerOpportunities: analysisResult.careerOpportunities,
        skillsToLearn: analysisResult.skillsToLearn,
        learningRoadmap: analysisResult.learningRoadmap,
      };

      const analysis = await storage.createCareerAnalysis(analysisData);
      res.json(analysis);
    } catch (error: any) {
      console.error("Error creating career analysis:", error);
      res.status(500).json({ message: error.message || "Failed to create career analysis" });
    }
  });

  app.get("/api/career-analysis/:profileId", async (req, res) => {
    try {
      const analysis = await storage.getCareerAnalysisByProfileId(req.params.profileId);
      if (!analysis) {
        return res.status(404).json({ message: "Career analysis not found" });
      }
      res.json(analysis);
    } catch (error: any) {
      console.error("Error fetching career analysis:", error);
      res.status(500).json({ message: "Failed to fetch career analysis" });
    }
  });

  // Chat/Conversation Routes
  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      res.status(400).json({ message: error.message || "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/profile/:profileId", async (req, res) => {
    try {
      const conversation = await storage.getConversationByProfileId(req.params.profileId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error: any) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, profileId, conversationId } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get profile for context if provided
      let profile = null;
      if (profileId) {
        profile = await storage.getStudentProfile(profileId);
      }

      // Get AI response
      const aiResponse = await getChatResponse(message, profile);

      // Update conversation with new messages
      if (conversationId) {
        const conversation = await storage.getConversation(conversationId);
        if (conversation) {
          const updatedMessages = [
            ...(Array.isArray(conversation.messages) ? conversation.messages : []),
            { role: "user", content: message, timestamp: new Date() },
            { role: "assistant", content: aiResponse, timestamp: new Date() }
          ];
          await storage.updateConversation(conversationId, updatedMessages);
        }
      }

      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: error.message || "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
