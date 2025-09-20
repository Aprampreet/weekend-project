"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
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
        console.log(e);
      }
    };
    fetchDashboard();
  }, [sessionID]);

  if (!data) return <p className="text-center text-white">Loading...</p>;

  const percentage = Math.round((data.total_score / data.max_score) * 100);

  const pieData = [
    { name: "Correct", value: data.correct_answers },
    { name: "Incorrect", value: data.incorrect_answers },
  ];

  return (
    <div className="min-h-screen mt-12 p-10 bg-black text-white space-y-8">
      {/* Score Summary */}
      <Card className="shadow-lg border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Session #{data.session_id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium text-white">
            Score:{" "}
            <span className="font-extrabold text-emerald-400">
              {data.total_score}
            </span>{" "}
            / {data.max_score}
          </p>
          <Progress
            value={percentage}
            className="mt-3 h-3 bg-white/10"
          />
          <p className="text-sm text-zinc-400 mt-2">{percentage}% achieved</p>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6 shadow-lg border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Answer Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-white">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
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
                    color:'white',
                    backgroundColor: "rgba(220, 220, 220, 0.9)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6 shadow-lg border border-white/10 bg-white/5 backdrop-blur-xl">
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
                    backgroundColor: "rgba(20,20,20,0.9)",
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

      {/* Questions List */}
      <Card className="p-6 shadow-lg border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white">
                Question Breakdown
            </CardTitle>
            <Button
                onClick={() => router.push(`/interview/${sessionID}`)}
                variant="outline"
                className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-full px-4 py-1 text-sm"
            >
                Practice Questions
            </Button>
            </CardHeader>

        <CardContent>
          <ul className="space-y-3">
            {data.questions.map((q: any) => (

              <Drawer key={q.id}>
              <DrawerTrigger>{q.text}</DrawerTrigger>
              <DrawerContent className="text-white">
                <DrawerHeader>
                  <DrawerTitle className="text-white">{q.text}</DrawerTitle>
                  <DrawerDescription className="text-white">{q.feedback}</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
           
            ))}
          </ul>
        </CardContent>
      </Card>
      
    </div>
  );
}
