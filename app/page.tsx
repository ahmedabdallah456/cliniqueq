// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard'); // change this to your target page
}
