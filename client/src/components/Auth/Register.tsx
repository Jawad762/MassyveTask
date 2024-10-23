"use client";
import React, { useState } from "react";
import Link from "next/link";
import Spinner from "../Reusable/Spinner";
import { updateUser } from "@/redux/mainSlice";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { api } from "@/axios";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setError(null);
      setIsLoading(true);
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const username = form.get("username");
      const password = form.get("password");

      const { data } = await api.post('/auth/register',
        {
          username,
          password,
        }
      );

      if (!data.data.user) {
        throw new Error();
      }

      dispatch(updateUser(data.data.user));
      router.push('/');
    } catch (error: any) {
      console.error(error);
      if (error.response.data.message) setError(error.response.data.message)
      else setError('Something went wrong')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 py-4 px-4 sm:px-8 flex flex-col">
      <div className="flex-1 flex flex-col justify-center w-full max-w-lg mx-auto space-y-6">
        <form onSubmit={handleLogin} className="space-y-5">
          <h2 className="text-4xl font-bold">Register</h2>
          {error && <p className="bg-darkSecondary p-3 rounded-md flex items-center gap-2 shadow-xl">⚠ {error}</p>}
          <div className="mb-5">
            <input
              id="username"
              name="username"
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-full p-3.5"
              placeholder="Username"
              minLength={3}
              maxLength={20}
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              minLength={6}
              className="bg-darkSecondary outline-none focus:ring-2 ring-goldPrimary text-white text-sm rounded-full focus:ring-goldPrimary focus:border-goldPrimary block w-full p-3.5"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-bluePrimary hover:bg-blueSecondary focus:ring-2 focus:outline-none focus:ring-goldPrimary rounded-full w-full py-2.5 text-center font-bold"
          >
            {isLoading ? <Spinner /> : "Submit"}
          </button>
        </form>

        <div className="border-t border-darkSecondary pt-6 relative">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[53%] bg-darkPrimary px-2 inline-block">
            OR
          </span>
          <Link
            href={"login"}
            className="block bg-white text-black focus:ring-2 focus:outline-none focus:ring-white rounded-full w-full py-2.5 text-center font-bold"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
