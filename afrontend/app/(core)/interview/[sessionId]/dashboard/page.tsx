"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { dashboard_session } from "@/lib/api";

const COLORS = ["#16a34a", "#dc2626"];

export default function SessionDashboard() {
  const router = useRouter();
  const { sessionId } = useParams();
  const sessionID = parseInt(sessionId as string);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const res = await dashboard_session(token, sessionID);
        setData(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDashboard();
  }, [sessionID]);

  if (!data) return <p className="text-center text-white mt-20">Loading...</p>;

  const percentage = Math.round((data.total_score / data.max_score) * 100);
  const pieData = [
    { name: "Correct", value: data.correct_answers },
    { name: "Incorrect", value: data.incorrect_answers },
  ];

  return (
    <div className="min-h-screen p-8 mt-10 md:p-12 bg-black text-white space-y-10">
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition hover:shadow-2xl">
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Session #{data.session_id}
          </CardTitle>
          <Button
            onClick={() => router.push(`/interview/${sessionID}`)}
            className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-orange-400 hover:scale-105 transform transition rounded-full px-6 py-2 font-semibold mt-4 md:mt-0"
          >
            Practice Questions
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <p className="text-lg font-medium text-white/90">
            Total Score:{" "}
            <span className="text-emerald-400 font-extrabold text-xl">
              {data.total_score}
            </span>{" "}
            / {data.max_score}
          </p>
          <Progress
            value={percentage}
            className="mt-3 h-4 rounded-xl bg-white/10"
          />
          <p className="text-sm text-zinc-400 mt-2">{percentage}% achieved</p>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Answer Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    color: 'white',
                    backgroundColor: "rgba(30,30,30,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Score per Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.questions}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="id" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(20,20,20,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Question List / Drawer */}
      <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition hover:shadow-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Question Breakdown
          </CardTitle>
          <Button
            onClick={() => router.push(`/interview/${sessionID}`)}
            variant="outline"
            className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-full px-4 py-1 text-sm"
          >
            Start Practice
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data.questions.map((q: any) => (
              <li
                key={q.id}
                className="bg-zinc-900/50 backdrop-blur-md rounded-xl shadow-md border border-zinc-700 overflow-hidden hover:scale-[1.02] transform transition"
              >
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="w-full text-left px-4 py-3 text-white font-medium hover:bg-zinc-800/60 transition-colors rounded-t-xl flex justify-between items-center">
                      {q.text}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                          q.score >= 5
                            ? "bg-emerald-600 text-black"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {q.score} / {q.max_score}
                      </span>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-zinc-900/90 text-white backdrop-blur-md p-6">
                    <DrawerHeader>
                      <DrawerTitle className="text-xl font-bold">{q.text}</DrawerTitle>
                      <DrawerDescription className="mt-2 text-zinc-300">
                        {q.feedback || "No feedback yet"}
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="mt-4">
                      <DrawerClose asChild>
                        <Button
                          variant="outline"
                          className="text-white border-zinc-600 hover:bg-zinc-800/60"
                        >
                          Close
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
