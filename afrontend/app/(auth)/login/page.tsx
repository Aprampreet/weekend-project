'use client';
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "@/lib/api";

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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <input
          {...register('username', { required: true })}
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.username && <span className="text-red-500">Username required</span>}

        <input
          {...register('password', { required: true })}
          placeholder="Password"
          type="password"
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.password && <span className="text-red-500">Password required</span>}

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
