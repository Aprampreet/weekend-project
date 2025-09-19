'use client';

import { getQuestions, Score, SubmitAnswer } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Question = {
  id: number;
  quest: string;
  answer?: string;
  feedback?: string;
  score?: number;
};

export default function InterviewSession() {
  const { sessionId } = useParams();
  const sessionID = parseInt(sessionId as string);
  const [index, setIndex] = useState(0);
  const [score,setScore] = useState<{total_score:number ;max_score:number }>({
     total_score: 0,
    max_score: 0,
  })

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const data = await getQuestions(token, sessionID);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, [sessionID]);

  const previousQ = () => {
    if (index > 0) setIndex(index - 1);
  };

  const nextQ = () => {
    if (index < questions.length - 1) setIndex(index + 1);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token") || "";
      await SubmitAnswer(token, questions[index].id, answer);
      setIndex(index + 1);
      const scoreData = await Score(token,sessionID)
      setScore(scoreData);
      setAnswer("");
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  return (
   <div className="h-screen flex flex-col bg-black text-white mt-16">
  <header className="  flex items-center justify-between px-8 py-5  backdrop-blur-md">
    <h1 className="text-xl font-bold tracking-wide">
      Question {index + 1} of {questions.length}
    </h1>
    <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-lg">
      Score: {score.total_score} / {score.max_score}
    </span>
  </header>

  <main className="flex-1 overflow-y-auto px-10 pt-28 pb-40 flex items-start justify-center">
    <div className="max-w-4xl text-center">
      <p className="text-2xl font-semibold leading-relaxed">
        {questions[index]?.quest || "⚡ Loading question..."}
      </p>
    </div>
  </main>

  <footer className="fixed bottom-0 left-0 right-0 z-50 p-8 border-t border-zinc-800 bg-black/80 backdrop-blur-xl space-y-6">
    <Textarea
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      placeholder="Type your brilliant answer here..."
      className="w-full min-h-[140px] bg-zinc-900/60 border border-zinc-700 rounded-xl text-white p-4 resize-none focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
    />

    <div className="flex items-center justify-between">
      <div className="space-x-3">
        <Button
          variant="outline"
          onClick={previousQ}
          disabled={index === 0}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white shadow-md disabled:opacity-40"
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          onClick={nextQ}
          disabled={index === questions.length - 1}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white shadow-md disabled:opacity-40"
        >
          Next
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={answer.length==0}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-neutral-600  via-neutral-700 to-neutral-600 cursor-pointer hover:from-zinc-700 hover:to-zinc-600 text-white shadow-md disabled:opacity-40"
      >
        Submit Answer
      </Button>
    </div>
  </footer>
</div>

  );
}
