import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveQuiz = mutation({
  args: { topic: v.string(), numQuestions: v.number(), difficulty: v.string(), questions: v.array(v.object({ question: v.string(), options: v.array(v.string()), correctIndex: v.number(), explanation: v.string() })) },
  handler: async (ctx, args) => await ctx.db.insert("quizzes", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("quizzes").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
