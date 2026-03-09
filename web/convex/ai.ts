import { action } from "./_generated/server";
import { v } from "convex/values";
export const generateQuiz = action({
    args: { topic: v.string(), numQuestions: v.optional(v.number()), difficulty: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const n = args.numQuestions || 10; const diff = args.difficulty || "mixed";
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    {
                        role: "system", content: `You are TriviaForge, a pub quiz master. Generate ${n} trivia questions about the given topic at ${diff} difficulty. Each question must have 4 options. Output JSON:
{"topic":"<topic>","numQuestions":${n},"difficulty":"${diff}","questions":[{"question":"<q>","options":["A","B","C","D"],"correctIndex":<0-3>,"explanation":"<why>"}]}`
                    },
                    { role: "user", content: args.topic },
                ], temperature: 0.7, max_tokens: 4000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error`);
        return JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
    },
});
