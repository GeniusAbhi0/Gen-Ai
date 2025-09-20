import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Please select your age"),
  educationLevel: z.string().min(1, "Please select your education level"),
  fieldOfStudy: z.string().optional(),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  skills: z.string().optional(),
  hobbies: z.string().optional(),
  careerGoals: z.string().optional(),
  workStyle: z.string().optional(),
  improvementAreas: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onComplete: (profileId: string) => void;
}

const interestOptions = [
  "Technology", "Business", "Healthcare", "Creative Arts", "Engineering", "Education",
  "Science", "Finance", "Marketing", "Design", "Research", "Social Work"
];

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = 3;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      age: "",
      educationLevel: "",
      fieldOfStudy: "",
      interests: [],
      skills: "",
      hobbies: "",
      careerGoals: "",
      workStyle: "",
      improvementAreas: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("POST", "/api/profiles", data);
      return response.json();
    },
    onSuccess: (profile) => {
      toast({
        title: "Profile Created!",
        description: "Your profile has been created successfully. Generating career analysis...",
      });
      onComplete(profile.id);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    createProfileMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="shadow-lg border border-border">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Create Your Student Profile</h2>
            <p className="text-muted-foreground">Help us understand you better to provide personalized career guidance</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Basic Info</span>
              <span>Interests & Skills</span>
              <span>Aspirations</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      {...form.register("fullName")}
                      data-testid="input-full-name"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Select onValueChange={(value) => form.setValue("age", value)} data-testid="select-age">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16-18">16-18</SelectItem>
                        <SelectItem value="19-21">19-21</SelectItem>
                        <SelectItem value="22-24">22-24</SelectItem>
                        <SelectItem value="25+">25+</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.age && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.age.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select onValueChange={(value) => form.setValue("educationLevel", value)} data-testid="select-education">
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.educationLevel && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.educationLevel.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      placeholder="e.g., Computer Science, Business, Arts"
                      {...form.register("fieldOfStudy")}
                      data-testid="input-field-of-study"
                    />
                  </div>
                </div>
                <Button type="button" onClick={nextStep} data-testid="button-next-step-1">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Interests & Skills */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Areas of Interest</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-accent cursor-pointer">
                        <Checkbox
                          id={interest}
                          checked={form.watch("interests").includes(interest)}
                          onCheckedChange={(checked) => {
                            const current = form.watch("interests");
                            if (checked) {
                              form.setValue("interests", [...current, interest]);
                            } else {
                              form.setValue("interests", current.filter(i => i !== interest));
                            }
                          }}
                          data-testid={`checkbox-interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label htmlFor={interest} className="text-sm cursor-pointer">{interest}</Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.interests && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.interests.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="skills">Current Skills & Strengths</Label>
                  <Textarea
                    id="skills"
                    placeholder="Describe your current skills, strengths, and any relevant experience..."
                    className="h-24 resize-none"
                    {...form.register("skills")}
                    data-testid="textarea-skills"
                  />
                </div>

                <div>
                  <Label htmlFor="hobbies">Hobbies & Extracurricular Activities</Label>
                  <Input
                    id="hobbies"
                    placeholder="e.g., coding, sports, volunteering, music"
                    {...form.register("hobbies")}
                    data-testid="input-hobbies"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={previousStep} data-testid="button-previous-step-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />Back
                  </Button>
                  <Button type="button" onClick={nextStep} data-testid="button-next-step-2">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Career Aspirations */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="careerGoals">Career Goals & Aspirations</Label>
                  <Textarea
                    id="careerGoals"
                    placeholder="What are your career goals? What kind of work environment do you prefer? Any specific companies or roles you're interested in?"
                    className="h-32 resize-none"
                    {...form.register("careerGoals")}
                    data-testid="textarea-career-goals"
                  />
                </div>

                <div>
                  <Label>Preferred Work Style</Label>
                  <RadioGroup
                    onValueChange={(value) => form.setValue("workStyle", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Remote work" id="remote" data-testid="radio-remote" />
                      <Label htmlFor="remote">Remote work</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Office-based" id="office" data-testid="radio-office" />
                      <Label htmlFor="office">Office-based</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Hybrid" id="hybrid" data-testid="radio-hybrid" />
                      <Label htmlFor="hybrid">Hybrid</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No preference" id="no-preference" data-testid="radio-no-preference" />
                      <Label htmlFor="no-preference">No preference</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="improvementAreas">Areas where you feel you need improvement</Label>
                  <Input
                    id="improvementAreas"
                    placeholder="e.g., public speaking, technical skills, leadership"
                    {...form.register("improvementAreas")}
                    data-testid="input-improvement-areas"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={previousStep} data-testid="button-previous-step-3">
                    <ArrowLeft className="mr-2 h-4 w-4" />Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProfileMutation.isPending}
                    data-testid="button-submit-profile"
                  >
                    {createProfileMutation.isPending ? (
                      "Creating Profile..."
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get My Career Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
