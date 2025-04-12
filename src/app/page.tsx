"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateLinkedInPost } from "@/ai/flows/generate-linkedin-post";
import { summarizeArticle } from "@/ai/flows/summarize-article";
import { calculateAlignmentScore } from "@/ai/flows/calculate-alignment-score";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const perspectiveStatements = [
  "AI should augment, not replace, human expertise.",
  "AI's primary goal is to improve patient outcomes and experiences.",
  "Ethical considerations are paramount in AI development and deployment.",
  "AI enables physicians to focus on complex decision-making and patient interaction.",
  "AI must be transparent and explainable to build trust."
];

export default function Home() {
  const [article, setArticle] = useState("");
  const [linkedinPost, setLinkedinPost] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLinkedinPost(null);
    setConfidenceScore(null);

    try {
      const summaryResult = await summarizeArticle({ article });
      const postResult = await generateLinkedInPost({
        articleSummary: summaryResult.summary,
        perspectiveStatements: perspectiveStatements,
      });

      setLinkedinPost(postResult.linkedinPost);
      const alignmentResult = await calculateAlignmentScore({
        post: postResult.linkedinPost,
        perspectives: perspectiveStatements,
      });

      setConfidenceScore(alignmentResult.score);

      toast({
        title: "Post generated successfully!",
        description: "Check the preview below.",
      });
    } catch (error: any) {
      console.error("Error generating post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate LinkedIn post.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
        AI Voice Amplified
      </h1>
      <p className="text-muted-foreground text-center mb-4">
        Generate LinkedIn posts that reflect your perspective on AI in healthcare.
      </p>

      <div className="w-full max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              placeholder="Enter article URL or summary"
              value={article}
              onChange={(e) => setArticle(e.target.value)}
            />
          </CardContent>
        </Card>

        <Button disabled={isGenerating} onClick={handleGenerate} className="w-full">
          {isGenerating ? "Generating..." : "Generate LinkedIn Post"}
        </Button>

        {linkedinPost && (
          <Card>
            <CardHeader>
              <CardTitle>Generated LinkedIn Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea readOnly value={linkedinPost} />
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  Confidence Score: {(confidenceScore! * 100).toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
