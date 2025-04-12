'use server';

/**
 * @fileOverview A LinkedIn post generator AI agent.
 *
 * - generateLinkedInPost - A function that handles the LinkedIn post generation process.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateLinkedInPostInputSchema = z.object({
  articleSummary: z.string().describe('The summary of the article.'),
  perspectiveStatements: z
    .array(z.string())
    .describe('The predefined perspective statements to inject.'),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

const GenerateLinkedInPostOutputSchema = z.object({
  linkedinPost: z
    .string()
    .describe('The generated LinkedIn post reflecting the client\'s philosophy.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

export async function generateLinkedInPost(
  input: GenerateLinkedInPostInput
): Promise<GenerateLinkedInPostOutput> {
  return generateLinkedInPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLinkedInPostPrompt',
  input: {
    schema: z.object({
      articleSummary: z.string().describe('The summary of the article.'),
      perspectiveStatements: z
        .array(z.string())
        .describe('The predefined perspective statements to inject.'),
    }),
  },
  output: {
    schema: z.object({
      linkedinPost: z
        .string()
        .describe('The generated LinkedIn post reflecting the client\'s philosophy.'),
    }),
  },
  prompt: `You are an AI assistant specializing in generating LinkedIn posts for a client physician. The client's philosophy is AI as an enabler.

  Generate a LinkedIn post (200-250 words) based on the following article summary and perspective statements. Ensure the post reflects the client's "AI as enabler" philosophy and incorporates the injected perspectives. Also, calculate a confidence score (0-1) indicating the alignment of the generated post with the client's views. 1 is perfectly aligned, 0 is not aligned. Output the LinkedIn post.
  Article Summary: {{{articleSummary}}}

  Perspective Statements:
  {{#each perspectiveStatements}}
  - {{{this}}}
  {{/each}}
  `,
});

const generateLinkedInPostFlow = ai.defineFlow<
  typeof GenerateLinkedInPostInputSchema,
  typeof GenerateLinkedInPostOutputSchema
>({
  name: 'generateLinkedInPostFlow',
  inputSchema: GenerateLinkedInPostInputSchema,
  outputSchema: GenerateLinkedInPostOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

