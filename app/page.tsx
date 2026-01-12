import Image from "next/image";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full max-w-md flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <form className="flex flex-col w-full space-y-2">
          <label htmlFor="id">Id</label>
          <input type="id" id="id" name="id" required className="border border-zinc-300 dark:border-zinc-700"/>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required className="border border-zinc-300 dark:border-zinc-700"/>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
        </form>
      </div>
    </main>
  );
}
