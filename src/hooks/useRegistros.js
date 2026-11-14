const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

async function carregar() {
  const url = API_URL || "/registros.json"; // sem env, continua lendo o JSON local
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}