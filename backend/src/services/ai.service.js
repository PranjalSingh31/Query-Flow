import dotenv from "dotenv";

dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { tool } from "@langchain/core/tools";

import { createAgent } from "langchain";

import * as z from "zod";

import { searchInternet } from "./internet.service.js";
const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-flash-lite-latest",
});

const searchInternetTool = tool(
  searchInternet,
  {
    name: "search_internet",
    description: "Use this tool to get the latest information from the internet",
    schema: z.object({
      query: z.string().describe("The search query to find information on the internet"),
    }),
  }
);

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

function isLiveNewsQuery(message = "") {
  const text = String(message).toLowerCase();
  return /(latest|current|breaking|today|headlines|news|india|world|global)/i.test(text);
}

export async function generateResponse(messages) {
  const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")?.content || "";

  if (isLiveNewsQuery(lastUserMessage)) {
    try {
      const searchResults = await searchInternet({ query: lastUserMessage });
      const results = Array.isArray(searchResults?.results) ? searchResults.results : [];

      if (results.length > 0) {
        return results
          .slice(0, 5)
          .map((result, index) => {
            const snippet = result.content || result.snippet || "";
            return `${index + 1}. ${result.title}\n${result.url}\n${snippet}`;
          })
          .join("\n\n");
      }
    } catch (error) {
      console.warn("Live news search failed:", error.message);
    }
  }

  const formattedMessages = {
    messages: [
      new SystemMessage(`You are a helpful assistant. If the user wants current or latest information, use the "search_internet" tool before answering.`),
      ...messages.map((msg) => {
        if (msg.role === "ai") {
          return new AIMessage(msg.content);
        }
        return new HumanMessage(msg.content);
      }),
    ],
  };

  const response = await agent.invoke(formattedMessages);

  return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
  try {
    const response = await geminiModel.invoke([
      new SystemMessage("Create a very short, clear chat title using at most 5 words. Return only the title, no quotes, no punctuation, no extra text."),
      new HumanMessage(`Message: ${String(message).trim()}`),
    ]);

    const title = String(response.text || "").trim();
    return title || "New chat";
  } catch (error) {
    console.warn("Title generation failed:", error.message);
    return "New chat";
  }
}