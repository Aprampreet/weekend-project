'use client';

import { getQuestions, Score, SubmitAnswer } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { readQuestionAloud } from "@/lib/tts";

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
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState("");
    const [repeatAvailable, setRepeatAvailable] = useState(false);

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
      if (index === questions.length - 1) {
        router.push(`/interview/${sessionID}/dashboard`);
      } else {
        setIndex(index + 1);
        setAnswer("");
      }
      const scoreData = await Score(token,sessionID)
      setScore(scoreData);
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };
      const handleReadQuestion = () => {
        setRepeatAvailable(false);
        readQuestionAloud(questions[index]?.quest, () => {
          setTimeout(() => {
            readQuestionAloud("Let's move to the next question.", () => {
              setRepeatAvailable(true); 
            });
          }, 4000); 
        });
      };

      const handleRepeat = () => {
  window.speechSynthesis.cancel(); 
  readQuestionAloud(questions[index]?.quest);
};
useEffect(() => {
  return () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };
}, []);




  return (
  <div className="h-screen mt-15 flex flex-col bg-black text-white">
  <header className=" flex items-center justify-between px-8 py-4 backdrop-blur-md bg-black/90 border-b border-zinc-800 shadow-md">
    <h1 className="text-xl md:text-2xl font-bold tracking-wide">
      Question {index + 1} of {questions.length}
    </h1>
    <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-lg">
      Score: {score.total_score} / {score.max_score}
    </span>
  </header>

  <main className="flex-1 overflow-y-auto pt-28 pb-40 px-6 md:px-10 flex items-start justify-center">
    <div className="max-w-4xl text-center">
      <p className="text-2xl md:text-3xl font-semibold leading-relaxed text-white/90">
        {questions[index]?.quest || "⚡ Loading question..."}
      </p>
    </div>
  </main>

  <footer className="fixed bottom-0 left-0 right-0 z-50 p-6 md:p-8 border-t border-zinc-800 bg-black/90 backdrop-blur-xl space-y-4">
    <div className="relative">
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your brilliant answer here..."
        className="w-full min-h-[140px] bg-zinc-900/60 border border-zinc-700 rounded-xl text-white p-4 resize-none focus:ring-2 focus:ring-fuchsia-500 focus:outline-none pr-12"
      />
      <button
        onClick={handleReadQuestion}
        className="absolute top-3 right-3 bg-neutral-600 hover:bg-neutral-500 text-white px-3 py-1 rounded-lg shadow-md text-sm"
      >
        🔊
      </button>
      {repeatAvailable && (
        <button
          onClick={handleRepeat}
          className="absolute top-12 right-3 bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg shadow-md text-sm"
        >
          🔄
        </button>
      )}
    </div>

    {/* Navigation & Submit */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
      <div className="flex gap-3 w-full md:w-auto">
        <Button
          variant="outline"
          onClick={previousQ}
          disabled={index === 0}
          className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white shadow-md disabled:opacity-40"
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          onClick={nextQ}
          disabled={index === questions.length - 1}
          className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white shadow-md disabled:opacity-40"
        >
          Next
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={answer.length === 0 && index !== questions.length - 1}
        className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-neutral-600 via-neutral-700 to-neutral-600 hover:from-zinc-700 hover:to-zinc-600 text-white shadow-md disabled:opacity-40"
      >
        {index === questions.length - 1 ? "Submit Assignment" : "Submit Answer"}
      </Button>
    </div>
  </footer>
</div>


  );
}
