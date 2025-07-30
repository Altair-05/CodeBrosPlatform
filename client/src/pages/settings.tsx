import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UpdateUser } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Save, User as UserIcon, Shield, Bell, Palette } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "C#", "C++",
  "Go", "Rust", "PHP", "Ruby", "Django", "Flask", "Express", "Spring Boot", "ASP.NET", "Laravel",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git",
  "CI/CD", "DevOps", "Machine Learning", "AI", "Data Science", "Mobile Development", "Flutter", "React Native",
  "UI/UX", "Figma", "Adobe XD", "HTML/CSS", "Sass", "Tailwind CSS", "Bootstrap", "GraphQL", "REST API"
];

export default function Settings() {
  const { currentUserId, isLoadingAuth, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState<UpdateUser>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    title: "",
    bio: "",
    experienceLevel: "beginner",
    skills: [],
    openToCollaborate: true,
    profileImage: "",
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access settings.",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [isAuthenticated, isLoadingAuth, setLocation, toast]);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useQuery<User, Error>({
    queryKey: ["userProfile", currentUserId],
    queryFn: async (): Promise<User> => {
      const response = await apiRequest("GET", `/api/users/${currentUserId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user profile data.'}));
        throw new Error(errorData.message);
      }
      return response.json();
    },
    enabled: !!currentUserId && !isLoadingAuth,
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading profile",
        description: error.message || "Failed to fetch user profile data.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: (userProfile as any).firstName,
        lastName: (userProfile as any).lastName,
        username: (userProfile as any).username,
        email: (userProfile as any).email,
        title: (userProfile as any).title || "",
        bio: (userProfile as any).bio ?? "",
        experienceLevel: (userProfile as any).experienceLevel,
        skills: (userProfile as any).skills ?? [],
        openToCollaborate: (userProfile as any).openToCollaborate ?? true,
        profileImage: (userProfile as any).profileImage ?? "",
      });
    }
  }, [userProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: UpdateUser) => {
      if (!currentUserId) {
        throw new Error("User ID not available for update.");
      }
      const response = await apiRequest("PATCH", `/api/users/${Number(currentUserId)}`, updatedData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'There was an error saving your profile.'}));
        throw new Error(errorData.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated!",
        description: "Your profile information has been successfully saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile", currentUserId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof UpdateUser, value: string | boolean | (string | null)[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    const skillToAdd = newSkill.trim();
    if (skillToAdd && !(formData.skills as any)?.includes(skillToAdd)) {
      const skillsArray = formData.skills || [];
      handleInputChange("skills", [...skillsArray, skillToAdd]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = (formData.skills as any)?.filter((skill: string) => skill !== skillToRemove) || [];
    handleInputChange("skills", updatedSkills);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoadingAuth || isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-500 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  if (!isAuthenticated || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Please Sign In
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You need to be signed in to access settings.
              </p>
              <Button onClick={() => setLocation("/login")}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <UserIcon size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "security"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Shield size={16} />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Bell size={16} />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("appearance")}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "appearance"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Palette size={16} />
                    <span>Appearance</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmitProfile} className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={formData.profileImage || undefined} alt="Profile Image" />
                        <AvatarFallback className="text-xl">
                          {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button type="button" variant="outline">Change Photo</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName || ""}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName || ""}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                          id="title"
                          value={formData.title || ""}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                          id="bio"
                          value={formData.bio || ""}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                          id="username"
                          value={formData.username || ""}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                      />
                    </div>

                    {/* Experience Level */}
                    <div>
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <Select
                          value={formData.experienceLevel || "beginner"}
                          onValueChange={(value) => handleInputChange("experienceLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                          <SelectItem value="professional">Professional (5+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Skills */}
                    <div>
                      <Label>Skills</Label>
                      <div className="flex gap-2 mb-3">
                        <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill..."
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} size="sm">
                          <Plus size={16} />
                        </Button>
                      </div>

                      {/* Selected Skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills?.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                  type="button"
                                  onClick={() => removeSkill(skill!)}
                                  className="ml-1 hover:text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                        ))}
                      </div>

                      {/* Popular Skills */}
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Popular skills:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {SKILLS_OPTIONS.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                  if (!(formData.skills as any)?.includes(skill)) {
                                    const skillsArray = formData.skills || [];
                                    handleInputChange("skills", [...skillsArray, skill]);
                                  }
                                }}
                                className={`px-2 py-1 text-xs rounded ${
                                  (formData.skills as any)?.includes(skill)
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                            >
                              {skill}
                            </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                          id="openToCollaborate"
                          checked={formData.openToCollaborate ?? true}
                          onCheckedChange={(checked) => handleInputChange("openToCollaborate", checked)}
                      />
                      <Label htmlFor="openToCollaborate">Open to collaboration opportunities</Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving Changes..." : <><Save size={16} className="mr-2" />Save Changes</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Other Tabs (Security, Notifications, Appearance) remain the same */}

          </div>
        </div>
      </div>
    </div>
  );
}