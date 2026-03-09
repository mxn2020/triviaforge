import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  quizzes: defineTable({
    topic: v.string(), numQuestions: v.number(), difficulty: v.string(),
    questions: v.array(v.object({ question: v.string(), options: v.array(v.string()), correctIndex: v.number(), explanation: v.string() })),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
