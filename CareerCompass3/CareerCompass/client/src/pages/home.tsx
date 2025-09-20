import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { ProfileForm } from "@/components/profile-form";
import { ChatInterface } from "@/components/chat-interface";
import { CareerRecommendations } from "@/components/career-recommendations";
import { Footer } from "@/components/footer";

type ViewState = "hero" | "profile" | "chat" | "recommendations";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>("hero");
  const [profileId, setProfileId] = useState<string | null>(null);

  const handleStartJourney = () => {
    setCurrentView("profile");
  };

  const handleChatWithMentor = () => {
    setCurrentView("chat");
  };

  const handleProfileComplete = (id: string) => {
    setProfileId(id);
    setCurrentView("recommendations");
  };

  const handleBackToHome = () => {
    setCurrentView("hero");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {currentView === "hero" && (
          <HeroSection 
            onStartJourney={handleStartJourney}
            onChatWithMentor={handleChatWithMentor}
          />
        )}

        {currentView === "profile" && (
          <ProfileForm onComplete={handleProfileComplete} />
        )}

        {currentView === "chat" && (
          <ChatInterface 
            profileId={profileId || undefined}
            onClose={handleBackToHome}
          />
        )}

        {currentView === "recommendations" && profileId && (
          <CareerRecommendations 
            profileId={profileId}
            onChatWithMentor={handleChatWithMentor}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
