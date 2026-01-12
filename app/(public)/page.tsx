'use client';

import { router } from "next/dist/client";

const Login = () => {

  const handleSignIn = () => {
    router.push('/dashboard');
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <form className="flex flex-col w-full space-y-2" action={handleSignIn}>
        <label htmlFor="id">Id</label>
        <input type="text" id="id" name="id" required className="border border-zinc-300 dark:border-zinc-700"/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required
          className="border border-zinc-300 dark:border-zinc-700"/>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login
        </button>
      </form>
    </div>
  )
};

export default Login;