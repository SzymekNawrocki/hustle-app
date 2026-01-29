"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const [msg, setMsg] = useState("Łączenie z backendem...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`)
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg("Błąd połączenia!"));
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1>{msg}</h1>
    </div>
  );
}