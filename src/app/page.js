"use client";
import { Toaster } from "react-hot-toast";
import TicketBookingForm from "./components/TicketBookingForm/page";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return null;

  return (
    <main className="flex w-full max-h-screen justify-center items-center  ">
      <TicketBookingForm />
      <Toaster position="bottom center" />
    </main>
  );
}
