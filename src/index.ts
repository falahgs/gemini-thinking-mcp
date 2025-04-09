#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required");
}

interface ChatCompletionArgs {
    prompt: string;
    max_tokens?: number;
    temperature?: number;
}

function isValidChatCompletionArgs(args: unknown): args is ChatCompletionArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "prompt" in args &&
        typeof (args as ChatCompletionArgs).prompt === "string" &&
        ((args as ChatCompletionArgs).max_tokens === undefined || typeof (args as ChatCompletionArgs).max_tokens === "number") &&
        ((args as ChatCompletionArgs).temperature === undefined || typeof (args as ChatCompletionArgs).temperature === "number")
    );
}

class GeminiServer {
    private server: Server;
    private genAI: GoogleGenerativeAI;

    constructor() {
        this.server = new Server(
            { name: "gemini-thinking", version: "1.0.0" },
            { capabilities: { tools: {} } }
        );

        this.genAI = new GoogleGenerativeAI(API_KEY!);

        this.setupHandlers();
        this.setupErrorHandling();
    }

    private setupErrorHandling(): void {
        this.server.onerror = (error: Error) => {
            console.error("[MCP Error]", error);
        };

        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    private setupHandlers(): void {
        this.server.setRequestHandler(
            ListToolsRequestSchema,
            async () => ({
                tools: [{
                    name: "gemini-thinking",
                    description: "Generate reasoning and action plan using gemini-2.0-flash-thinking-exp-01-21",
                    inputSchema: {
                        type: "object",
                        properties: {
                            prompt: {
                                type: "string",
                                description: "Input text for Gemini"
                            },
                            max_tokens: {
                                type: "number",
                                description: "Maximum tokens to generate (default: 8192)",
                                minimum: 1,
                                maximum: 8192
                            },
                            temperature: {
                                type: "number",
                                description: "Sampling temperature (default: 0.2)",
                                minimum: 0,
                                maximum: 2
                            }
                        },
                        required: ["prompt"]
                    }
                }]
            })
        );

        this.server.setRequestHandler(
            CallToolRequestSchema,
            async (request) => {
                if (request.params.name !== "gemini-thinking") {
                    throw new McpError(
                        ErrorCode.MethodNotFound,
                        `Unknown tool: ${request.params.name}`
                    );
                }

                if (!isValidChatCompletionArgs(request.params.arguments)) {
                    throw new McpError(
                        ErrorCode.InvalidParams,
                        "Invalid chat completion arguments"
                    );
                }

                try {
                    const model = this.genAI.getGenerativeModel({
                        model: "gemini-2.0-flash-thinking-exp-01-21",
                        generationConfig: {
                            maxOutputTokens: request.params.arguments.max_tokens ?? 8192,
                            temperature: request.params.arguments.temperature ?? 0.2
                        }
                    });

                    const prompt = request.params.arguments.prompt;
                    const result = await model.generateContent(prompt);
                    const response = result.response;
                    const text = response.text();

                    return {
                        content: [{
                            type: "text",
                            text: text || "No response"
                        }]
                    };
                } catch (error) {
                    console.error("Gemini API error:", error);
                    return {
                        content: [{
                            type: "text",
                            text: `Gemini API error: ${error instanceof Error ? error.message : String(error)}`
                        }],
                        isError: true
                    };
                }
            }
        );
    }

    async run(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Gemini 1.5 Flash MCP server running on stdio");
    }
}

const server = new GeminiServer();
server.run().catch(console.error);