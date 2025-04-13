'use server';
/**
 * @fileOverview Summarizes an article URL or summary into a concise summary.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  article: z.string().describe('The URL or summary of the article to summarize.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error('Invalid content type. Expected text/html.');
    }
    const text = await response.text();
    // Basic sanitization to remove HTML tags - consider using a more robust library like DOMPurify
    return text.replace(/<[^>]*>/g, '');
  } catch (error: any) {
    console.error('Error fetching article:', error);
    throw new Error(`Failed to fetch article content: ${error.message}`);
  }
}

const summarizeArticlePrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {
    schema: z.object({
      article: z.string().describe('The text of the article to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the article.'),
    }),
  },
  prompt: `Summarize the following article into a concise summary that provides context for generating a LinkedIn post. Focus on the key points and arguments:\n\n{{{article}}}`,
});

const summarizeArticleFlow = ai.defineFlow<
  typeof SummarizeArticleInputSchema,
  typeof SummarizeArticleOutputSchema
>(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    let articleContent = input.article;
    // Check if the input is a URL and fetch the content
    if (input.article.startsWith('http://') || input.article.startsWith('https://')) {
      try {
        articleContent = await fetchArticleContent(input.article);
      } catch (error: any) {
        throw new Error(`Failed to fetch and process article from URL: ${error.message}`);
      }
    }

    // Check if the article content is health-related
    const isHealthRelated = articleContent.toLowerCase().includes('health') ||
                            articleContent.toLowerCase().includes('medical') ||
                            articleContent.toLowerCase().includes('disease') ||
                            articleContent.toLowerCase().includes('patient');

    if (!isHealthRelated) {
      return { summary: "I can not talk about this." };
    }

    const {output} = await summarizeArticlePrompt({ article: articleContent });
    return output!;
  }
);
