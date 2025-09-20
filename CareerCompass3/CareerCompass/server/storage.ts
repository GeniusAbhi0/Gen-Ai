import { type User, type InsertUser, type StudentProfile, type InsertStudentProfile, type Conversation, type InsertConversation, type CareerAnalysis, type InsertCareerAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  getStudentProfile(id: string): Promise<StudentProfile | undefined>;
  updateStudentProfile(id: string, profile: Partial<InsertStudentProfile>): Promise<StudentProfile | undefined>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationByProfileId(profileId: string): Promise<Conversation | undefined>;
  updateConversation(id: string, messages: any[]): Promise<Conversation | undefined>;
  
  createCareerAnalysis(analysis: InsertCareerAnalysis): Promise<CareerAnalysis>;
  getCareerAnalysisByProfileId(profileId: string): Promise<CareerAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private studentProfiles: Map<string, StudentProfile>;
  private conversations: Map<string, Conversation>;
  private careerAnalyses: Map<string, CareerAnalysis>;

  constructor() {
    this.users = new Map();
    this.studentProfiles = new Map();
    this.conversations = new Map();
    this.careerAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createStudentProfile(insertProfile: InsertStudentProfile): Promise<StudentProfile> {
    const id = randomUUID();
    const profile: StudentProfile = { 
      ...insertProfile, 
      id,
      createdAt: new Date(),
    };
    this.studentProfiles.set(id, profile);
    return profile;
  }

  async getStudentProfile(id: string): Promise<StudentProfile | undefined> {
    return this.studentProfiles.get(id);
  }

  async updateStudentProfile(id: string, updateData: Partial<InsertStudentProfile>): Promise<StudentProfile | undefined> {
    const existing = this.studentProfiles.get(id);
    if (!existing) return undefined;
    
    const updated: StudentProfile = { ...existing, ...updateData };
    this.studentProfiles.set(id, updated);
    return updated;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationByProfileId(profileId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conv) => conv.profileId === profileId,
    );
  }

  async updateConversation(id: string, messages: any[]): Promise<Conversation | undefined> {
    const existing = this.conversations.get(id);
    if (!existing) return undefined;
    
    const updated: Conversation = { ...existing, messages };
    this.conversations.set(id, updated);
    return updated;
  }

  async createCareerAnalysis(insertAnalysis: InsertCareerAnalysis): Promise<CareerAnalysis> {
    const id = randomUUID();
    const analysis: CareerAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.careerAnalyses.set(id, analysis);
    return analysis;
  }

  async getCareerAnalysisByProfileId(profileId: string): Promise<CareerAnalysis | undefined> {
    return Array.from(this.careerAnalyses.values()).find(
      (analysis) => analysis.profileId === profileId,
    );
  }
}

export const storage = new MemStorage();
