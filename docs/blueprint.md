# **App Name**: AI Voice Amplified

## Core Features:

- Article Contextualization: Accepts an article summary or URL as input and generates a concise summary for context.
- Perspective Injection: Applies predefined perspective statements (provided as configuration) to the article summary, ensuring the generated content aligns with the client's viewpoints. The LLM acts as a tool to incorporate the viewpoints.
- Post Generation: Generates a LinkedIn post (200-250 words) that reflects the client's 'AI as enabler' philosophy, incorporating the injected perspectives.
- Alignment Scoring: Calculates a confidence score indicating the alignment of the generated post with the client's views, providing a measure of reliability.
- Content Preview: Provides a simple user interface for inputting article information (URL or summary) and displaying the generated LinkedIn post along with the confidence score.

## Style Guidelines:

- Primary color: White (#FFFFFF) for a clean, professional look.
- Secondary color: Light gray (#F0F0F0) for backgrounds and subtle contrasts.
- Accent: Teal (#008080) for interactive elements and highlights.
- Clean and professional font for readability and accessibility.
- Simple, single-column layout optimized for readability on various screen sizes.
- Use minimalist icons to represent different functionalities.

## Original User Request:
Perspective-Driven Content Generation

Task: Implement an AI service that generates LinkedIn posts reflecting the client physician's perspective on healthcare AI topics.

Specific Requirements:

1. Use Azure OpenAI Service, Google Vertex AI, or AWS Bedrock (managed AI services)
2. Create a function that:
  * Takes an article summary/URL as input
  * Applies supplied perspective statements (we'll provide 5-7 key viewpoints)
  * Generates a LinkedIn post (200-250 words) reflecting the client's "AI as enabler" philosophy
3. Implement prompt engineering techniques to maintain consistent tone and perspective
4. Include a confidence score indicating alignment with the client's views

Deliverables:

* Working API that accepts article information and returns generated content
* Code for the prompt engineering approach
* 3 sample outputs for provided test articles
* Brief explanation of design decisions and limitations

Evaluation Focus: Effective prompt engineering, perspective alignment, managed AI service implementation
  