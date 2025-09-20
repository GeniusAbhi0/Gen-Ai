import { Button } from "@/components/ui/button";
import { Rocket, MessageCircle } from "lucide-react";

interface HeroSectionProps {
  onStartJourney: () => void;
  onChatWithMentor: () => void;
}

export function HeroSection({ onStartJourney, onChatWithMentor }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover Your{" "}
            <span className="gradient-text">Perfect Career Path</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-powered personalized career guidance to help students explore their strengths, 
            discover opportunities, and build the skills needed for their dream career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onStartJourney} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
              data-testid="button-start-journey"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onChatWithMentor}
              data-testid="button-chat-mentor"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat with AI Mentor
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-students">10K+</div>
            <div className="text-muted-foreground">Students Guided</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-paths">500+</div>
            <div className="text-muted-foreground">Career Paths Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-satisfaction">95%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
