import "dotenv/config";
import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const reviewResultSchema = z.object({
  line: z
    .number()
    .nullable()
    .describe(
      "Line number where the issue occurs. Use 1-based line numbers. If the issue applies to the entire file or cannot be tied to a specific line, return null.",
    ),

  severity: z
    .enum(["critical", "warning", "info"])
    .describe(
      "Issue severity. Use 'critical' for security vulnerabilities, runtime errors, data loss risks, or severe bugs. Use 'warning' for performance issues, code smells, maintainability concerns, or potential bugs. Use 'info' for suggestions, best practices, or minor improvements.",
    ),

  category: z
    .enum([
      "security",
      "performance",
      "maintainability",
      "bug",
      "best-practice",
    ])
    .describe(
      "Issue category. security = vulnerabilities or unsafe code. performance = inefficient code or resource waste. maintainability = readability, complexity, or technical debt concerns. bug = logic errors, incorrect behavior, edge cases, or runtime issues. best-practice = coding standards, conventions, or recommended improvements.",
    ),

  message: z
    .string()
    .describe(
      "Short description of the issue. Be specific and explain what is wrong. Maximum 1-2 sentences.",
    ),

  suggestion: z
    .string()
    .describe(
      "Actionable recommendation to fix the issue. Provide a concrete improvement rather than repeating the issue.",
    ),
});

export const codeReviewResponseSchema = z
  .object({
    score: z.number().min(0).max(100).describe(`
Overall code quality score.

Scoring Guidelines:
90-100: Production ready. Only minor style or convention issues.
75-89: Good code with some maintainability or performance concerns.
50-74: Multiple meaningful issues requiring attention.
25-49: Serious bugs, poor design, or major maintainability concerns.
0-24: Critical issues, security risks, or code that is likely broken.

Do not heavily penalize missing semicolons, formatting, or minor stylistic issues.
`),

    summary: z
      .string()
      .describe(
        "A concise overall review summary describing code quality, strengths, weaknesses, and major concerns. Maximum 3 sentences.",
      ),

    results: z
      .array(reviewResultSchema)
      .max(10)
      .describe(
        "List of code review findings ordered from most important to least important. Include only meaningful findings. Return an empty array if no issues are found.",
      ),
  })
  .describe(
    "Structured AI code review result containing an overall quality score, summary, and detailed findings.",
  );

async function generateAiReview({ code, language }) {
  const SYSTEM_PROMPT = `You are a senior staff software engineer performing a professional code review.

        Review the provided code for:
        - Security vulnerabilities
        - Performance problems
        - Bugs and edge cases
        - Maintainability concerns
        - Best practice violations

        Rules:
        - Prioritize high-impact issues.
        - Do not invent issues that do not exist.
        - Provide accurate line numbers whenever possible.
        - Keep findings concise and actionable.
        - Return at most 10 findings.
        - If the code is excellent, return an empty results array and a high score.
        - Return valid JSON matching the provided schema.
        - Do not report formatting issues, linting issues, or style-only issues such as missing semicolons, quote styles, or spacing.

        Focus on meaningful engineering concerns.
    `;

  const USER_PROMPT = `
        Language: ${language}

        Review the following code:

        \`\`\`${language}
        ${code}
        \`\`\`
    `;

  const compilation = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: USER_PROMPT,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "code_review",
        schema: z.toJSONSchema(codeReviewResponseSchema),
      },
    },
  });

  const response = JSON.parse(compilation.choices[0].message.content);

  const result = codeReviewResponseSchema.parse(response);
  return result;
}

export default generateAiReview