"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen w-full ">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-12 py-32 md:pt-48">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-gray-400 drop-shadow-lg">
          AI-Powered Interview Prep
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
          Practice interviews, get real-time AI feedback, and ace your next opportunity with confidence.
        </p>
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="border-gray-500 hover:border-white hover:text-white">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-24 grid gap-8 md:grid-cols-3">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex items-center gap-4">
            <MessageCircle className="w-6 h-6 text-white" />
            <CardTitle>AI Interviewer</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-300">
              Experience realistic AI mock interviews with instant suggestions to improve your answers.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex items-center gap-4">
            <Zap className="w-6 h-6 text-white" />
            <CardTitle>Instant Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-300">
              Get AI-powered feedback on your answers, tone, and confidence to enhance your interview skills.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex items-center gap-4">
            <Users className="w-6 h-6 text-white" />
            <CardTitle>Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-300">
              Monitor your improvement over time and focus on areas that need more attention.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col items-center text-center px-6 md:px-12 py-24 bg-white/5 backdrop-blur-md rounded-xl mx-6 md:mx-24">
        <h2 className="text-4xl font-bold text-white">Ready to Ace Your Interviews?</h2>
        <p className="mt-4 text-gray-300 max-w-xl">
          Sign up now and start practicing with your AI interview assistant. Transform your preparation experience today.
        </p>
        <Button size="lg" className="mt-8 bg-white text-black hover:bg-gray-200">
          Start Practicing
        </Button>
      </section>
    </main>
  );
}
