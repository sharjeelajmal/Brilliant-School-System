import { redirect } from 'next/navigation';

export default function Home() {
  // Jab koi site khole, usay foran dashboard par bhejo.
  // Middleware wahan pakar le ga ke login hai ya nahi.
  redirect('/dashboard');
}