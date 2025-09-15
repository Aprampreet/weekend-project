"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDashboard } from "@/lib/api";
import { Search, Plus } from "lucide-react";
export default function Dashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    getDashboard(token).then((data) => {
      setSessions(data);
    });
  }, [router]);

  return (
    <main className="bg-black text-white min-h-screen w-full px-10">
      <div className="flex items-center justify-between mb-12 md:pt-30">
        <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>

        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              className="pl-10 bg-transparent border border-white/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/40"
            />
          </div>

          <Button onClick={()=>router.push("/create-session")} className="bg-white text-black hover:bg-gray-200 flex items-center gap-2 rounded-full px-5 py-2 font-medium">
            <Plus className="w-5 h-5" /> New Session
          </Button>
        </div>
      </div>

      <div className="w-full border-t border-white/10">
        <div className="grid grid-cols-4 px-4 md:px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-white/10">
          <span>Session</span>
          <span>Category</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-4 px-4 md:px-6 py-5 items-center text-gray-200 border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            <span className="font-medium">{session.session_name}</span>
            <span className="text-gray-400">{session.category}</span>
            <span
              className={`${
                session.result === "Completed"
                  ? "text-green-400"
                  : session.result === "Pending"
                  ? "text-yellow-400"
                  : "text-blue-400"
              } font-medium`}
            >
              {session.result}
            </span>
            <div className="flex justify-end">
              <Button
              onClick={() => router.push(`/interview/${session.id}`)}
              variant="outline"
              className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-full px-4 py-1 text-sm"
            >
              Details
            </Button>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
