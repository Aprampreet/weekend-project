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

    getDashboard(token).then((data) => setSessions(data));
  }, [router]);

  return (
    <main className="bg-black mt-14 text-white min-h-screen w-full px-4 md:px-16 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white/90">
          Interview Dashboard
        </h1>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              className="pl-10 bg-zinc-900/40 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-white/30 rounded-full w-full"
            />
          </div>

          <Button
            onClick={() => router.push("/create-session")}
            className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-orange-400 hover:scale-105 transform transition rounded-full px-6 py-2 flex items-center gap-2 font-semibold shadow-lg w-full md:w-auto"
          >
            <Plus className="w-5 h-5" /> New Session
          </Button>
        </div>
      </div>

      {/* Table Header - Hidden on small screens */}
      <div className="hidden md:grid grid-cols-4 px-4 md:px-6 py-3 text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
        <span>Session</span>
        <span>Category</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Sessions List */}
      <div className="space-y-4 mt-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid md:grid-cols-4 gap-2 px-4 md:px-6 py-4 items-center bg-zinc-900/50 border border-white/10 rounded-xl hover:bg-zinc-900/70 transition-colors shadow-sm"
          >
            {/* Mobile-friendly stacked layout */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 col-span-1 md:col-span-1">
              <span className="font-medium text-white/90">{session.session_name}</span>
              <span className="text-gray-400 md:hidden">{session.category}</span>
            </div>

            <span className="hidden md:inline text-gray-400">{session.category}</span>

            <span
              className={`font-semibold ${
                session.result === "Completed"
                  ? "text-emerald-400"
                  : session.result === "Pending"
                  ? "text-yellow-400"
                  : "text-blue-400"
              }`}
            >
              {session.result}
            </span>

            <div className="flex flex-col md:flex-row justify-end gap-2">
              <Button
                onClick={() => router.push(`/interview/${session.id}/dashboard`)}
                variant="outline"
                className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-full px-4 py-1 text-sm"
              >
                Details
              </Button>
              <Button
                onClick={() => router.push(`/interview/${session.id}`)}
                variant="outline"
                className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-full px-4 py-1 text-sm"
              >
                Start
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
