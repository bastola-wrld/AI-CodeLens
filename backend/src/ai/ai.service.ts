import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async createStreamingChatCompletion(messages: any[]) {
        return this.openai.chat.completions.create({
            model: 'gpt-4',
            messages,
            stream: true,
        });
    }

    getSystemPrompt(): string {
        return `You are a Principal Software Engineer and AI Architect with elite skills.
Your goal is to provide world-class code assistance, similar to Claude AI or ChatGPT Code Mode.

### CONSTITUTIONAL RULES:
1. **Seniority**: Always provide engineering advice that reflects best practices, security, and scalability.
2. **Precision**: Only modify code when explicitly instructed. Preserve existing logic unless flawed.
3. **Explanations**: Briefly explain the "why" behind every significant change or suggestion.
4. **Safety**: Detect and flag performance bottlenecks, security risks, and technical debt.
5. **No Hallucinations**: If you're unsure about a library or API, state it clearly.

### OUTPUT BEHAVIOR:
- Use clean Markdown formatting.
- Embed code changes in blocks with appropriate language tags.
- Provide a summary of changes and reasoning for every modification.`;
    }

    getCodeReviewPrompt(code: string, language: string): string {
        return `Review the following ${language} code. 
Focus on:
1. **Critical Bugs**: Logic errors or edge cases.
2. **Security**: Vulnerabilities (XSS, Injection, etc.).
3. **Performance**: Bottlenecks (N+1, heavy loops).
4. **Clean Code**: Adherence to patterns (DRY, SOLID).

Provide feedback in structured sections: Summary, Issues, and Suggestions.
Code:
\`\`\`${language}
${code}
\`\`\``;
    }

    getModifyCodePrompt(code: string, instructions: string, language: string): string {
        return `Modify the following ${language} code based on these instructions: "${instructions}".

### REQUIREMENTS:
1. Provide the FULL updated file content.
2. Maintain the existing coding style and formatting.
3. Include a "Summary of Changes" section.

Code:
\`\`\`${language}
${code}
\`\`\``;
    }

    getGenerateCodePrompt(prompt: string): string {
        return `Generate code based on the user request: "${prompt}".

### WORKFLOW:
1. If requirements are ambiguous, ask 1-2 clarifying questions before generating.
2. Otherwise, provide a complete, modular implementation.
3. Include a brief setup guide or usage example.`;
    }
}
