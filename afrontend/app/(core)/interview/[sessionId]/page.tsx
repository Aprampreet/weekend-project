'use client';

import { getQuestions } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Question = {
  id: number;
  quest: string;
};

export default function InterviewSession() {
  const { sessionId } = useParams();
  const sessionID = parseInt(sessionId as string);
  const [index , setindex] = useState(0);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer,setAnswer] = useState('')

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
  const previousQ= () => {
    if(index>0) setindex(index-1);

  }
  const nextQ = () => {
    if(index<questions.length -1) setindex(index+1);
  }
  const handleSubmit = async() => {
    if(!questions[index]) return;
    

  }

  


  return (
    <div className="mt-20">
  {questions[index]}
  <div>
  <button className="bg-gray-200 rounded text-black px-2 " onClick={previousQ}>prev</button>
  <button className="bg-gray-200 rounded text-black px-2" onClick={nextQ}>next</button>
  </div>
</div>

  );
}
