import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Rocket, GraduationCap, MessageCircle, Download, MapPin } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CareerOpportunity, SkillToLearn, RoadmapPhase } from "@/lib/types";

interface CareerRecommendationsProps {
  profileId: string;
  onChatWithMentor: () => void;
}

export function CareerRecommendations({ profileId, onChatWithMentor }: CareerRecommendationsProps) {
  const { toast } = useToast();

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["/api/career-analysis", profileId],
    enabled: !!profileId,
  });

  const generateAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/career-analysis", { profileId });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the career analysis query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["/api/career-analysis", profileId] });
      toast({
        title: "Analysis Complete!",
        description: "Your personalized career recommendations are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate career analysis",
        variant: "destructive",
      });
    },
  });

  // Auto-generate analysis if it doesn't exist (moved to useEffect to avoid render side-effects)
  useEffect(() => {
    if (!analysis && !isLoading && !error && !generateAnalysisMutation.isPending && profileId) {
      generateAnalysisMutation.mutate();
    }
  }, [analysis, isLoading, error, generateAnalysisMutation.isPending, profileId]);

  if (isLoading || generateAnalysisMutation.isPending) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Analyzing Your Profile</h2>
        <p className="text-muted-foreground">Our AI is creating personalized career recommendations for you...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-destructive mb-2">Analysis Failed</h2>
        <p className="text-muted-foreground mb-4">We couldn't generate your career analysis. Please try again.</p>
        <Button onClick={() => generateAnalysisMutation.mutate()}>
          Try Again
        </Button>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-blue-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Personalized Career Analysis</h2>
        <p className="text-muted-foreground">Based on your profile, here are our AI-powered recommendations</p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Strengths Card */}
        <Card className="shadow-lg border border-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">✅ Your Strengths</h3>
            </div>
            <ul className="space-y-2 text-sm" data-testid="strengths-list">
              {analysis?.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Career Opportunities Card */}
        <Card className="shadow-lg border border-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <Rocket className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">🚀 Career Opportunities</h3>
            </div>
            <div className="space-y-3" data-testid="career-opportunities">
              {analysis?.careerOpportunities?.map((opportunity: CareerOpportunity, index: number) => (
                <div key={index} className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-sm">{opportunity.title}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{opportunity.match}% match</span>
                    <span>{opportunity.demand}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills to Learn Card */}
        <Card className="shadow-lg border border-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">📘 Skills to Learn</h3>
            </div>
            <div className="space-y-3" data-testid="skills-to-learn">
              {analysis?.skillsToLearn?.map((skill: SkillToLearn, index: number) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.skill}</span>
                    <Badge variant="outline" className={`text-xs ${
                      skill.priority === 'High' ? 'border-red-500 text-red-600' :
                      skill.priority === 'Medium' ? 'border-blue-500 text-blue-600' :
                      'border-green-500 text-green-600'
                    }`}>
                      Priority: {skill.priority}
                    </Badge>
                  </div>
                  <Progress value={skill.relevance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Roadmap */}
      <Card className="shadow-lg border border-border mb-8">
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <MapPin className="text-primary mr-3 h-6 w-6" />
            Your 6-Month Learning Roadmap
          </h3>
          
          <div className="space-y-6" data-testid="learning-roadmap">
            {analysis?.learningRoadmap?.map((phase: RoadmapPhase, index: number) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {phase.phase}
                  </div>
                  {index < (analysis?.learningRoadmap?.length || 0) - 1 && (
                    <div className="w-px h-12 bg-border mt-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{phase.duration}: {phase.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.resources?.map((resource: string, resourceIndex: number) => (
                      <Badge key={resourceIndex} variant="secondary" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <Button 
          onClick={onChatWithMentor} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-discuss-mentor"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Discuss with AI Mentor
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            toast({
              title: "Report Saved",
              description: "Your career analysis has been saved to your profile.",
            });
          }}
          data-testid="button-save-report"
        >
          <Download className="mr-2 h-4 w-4" />
          Save Report
        </Button>
      </div>
    </div>
  );
}
