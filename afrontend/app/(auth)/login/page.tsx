'use client';
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "@/lib/api";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await loginUser(data); 
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);
      router.push('/profile');
    } catch (e) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
  <form 
    onSubmit={handleSubmit(onSubmit)} 
    className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl flex flex-col gap-6"
  >
    <div className="text-center">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
        Welcome Back
      </h1>
      <p className="mt-2 text-gray-300">Login to your AI Interview Assistant</p>
    </div>

    <Card className="bg-white/5 border border-white/20 backdrop-blur-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-white">Login</CardTitle>
        <CardDescription className="text-gray-400">
          Enter your credentials to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <input
          {...register('username', { required: true })}
          placeholder="Username"
          className="w-full p-3 rounded-xl border border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
        {errors.username && <span className="text-red-500 text-sm">Username required</span>}

        <input
          {...register('password', { required: true })}
          placeholder="Password"
          type="password"
          className="w-full p-3 rounded-xl border border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
        {errors.password && <span className="text-red-500 text-sm">Password required</span>}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <a href="#" className="text-sm text-purple-400 hover:text-purple-500 transition">
          Forgot Password?
        </a>
      </CardFooter>
    </Card>

    <button
      type="submit"
      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
    >
      Login
    </button>

    <p className="text-center text-gray-400 text-sm mt-2">
      Don’t have an account? <a href="/register" className="text-purple-400 hover:text-purple-500 font-medium">Sign Up</a>
    </p>
  </form>

 
</div>

  );
}
