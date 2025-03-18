import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const aiPrompt = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt;
    console.log(prompt)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log(result)
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
