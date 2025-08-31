"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createSession } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type FormValues = {
  session_name: string;
  job_discription: string;
  category: string;
  num_questions: number;
  resume?: FileList;
};

export default function CreateSessionForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token")?.trim();
    setToken(t || null);
  }, []);

  const onSubmit = async (data: FormValues) => {
    setMessage("");
    if (!token) {
      setMessage("⚠️ You must be logged in to create a session");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("session_name", data.session_name);
      formData.append("job_discription", data.job_discription);
      formData.append("category", data.category);
      formData.append("num_questions", data.num_questions.toString());
      if (data.resume?.[0]) formData.append("resume", data.resume[0]);

      await createSession(token, formData);
      setMessage(" Session created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      setMessage(" Failed to create session");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-6"
      >
        <h2 className="text-4xl font-bold text-center tracking-tight">Create Interview Session</h2>
        
        <div className="space-y-2">
          <Label htmlFor="session_name">Session Name</Label>
          <Input
            id="session_name"
            placeholder="Enter session name"
            className="bg-zinc-900 border-zinc-700 text-white"
            {...register("session_name", { required: "Session name is required" })}
          />
          {errors.session_name && <p className="text-red-400 text-sm">{errors.session_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_discription">Job Description</Label>
          <Textarea
            id="job_discription"
            placeholder="Enter job description"
            className="bg-zinc-900 border-zinc-700 text-white resize-none"
            rows={4}
            {...register("job_discription", { required: "Job description is required" })}
          />
          {errors.job_discription && <p className="text-red-400 text-sm">{errors.job_discription.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <div>
  <label className="block mb-1 font-medium text-sm">Category</label>
  <select
    className="w-full border rounded p-2 bg-zinc-900 text-white"
    {...register("category", { required: "Category is required" })}
  >
    <option value="">Select category</option>
    <option value="Web Development">Web Development</option>
    <option value="Data Science">Data Science</option>
    <option value="Mobile Development">Mobile Development</option>
    <option value="AI/ML">AI/ML</option>
  </select>
  {errors.category && (
    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
  )}
</div>

          <input type="hidden" id="category-hidden" {...register("category", { required: true })} />
          {errors.category && <p className="text-red-400 text-sm">Category is required</p>}
        </div>

        {/* Number of Questions */}
        <div className="space-y-2">
          <Label htmlFor="num_questions">Number of Questions</Label>
          <Input
            id="num_questions"
            type="number"
            className="bg-zinc-900 border-zinc-700 text-white"
            {...register("num_questions", { required: "Number of questions is required", min: 1 })}
          />
          {errors.num_questions && <p className="text-red-400 text-sm">{errors.num_questions.message}</p>}
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <Label htmlFor="resume">Upload Resume (Optional)</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="bg-zinc-900 border-zinc-700 text-white file:text-white file:bg-zinc-800 file:border-none"
            {...register("resume")}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
        >
          {isSubmitting ? "Creating..." : "Create Session"}
        </Button>

        {/* Message */}
        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}
