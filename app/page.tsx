
"use client";

import { useState } from "react";
import { Send, Plus, Menu, Sparkles, MessageSquare, Bot } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebar, setSidebar] = useState(true);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const text = message;
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!response.ok) throw new Error("Erro na conexão");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Resposta indisponível");

      const decoder = new TextDecoder();
      let answer = "";

      setMessages([...updated, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        answer += chunk;

        const parts = answer.split("\n");
        answer = parts.join("\n");

        const content = answer
          .split("\n")
          .filter((line) => line.startsWith("0:"))
          .map((line) => {
            try {
              return JSON.parse(line.slice(2));
            } catch {
              return "";
            }
          })
          .join("");

        setMessages([...updated, { role: "assistant", content }]);
      }
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Ainda estou sendo configurada! Em breve poderei responder suas mensagens. ✨",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen bg-[#080b18] text-white overflow-hidden">
      {sidebar && (
        <aside className="w-64 bg-[#0d1225] border-r border-white/10 p-4 flex flex-col">
          <div className="text-2xl font-bold text-blue-400 mb-8">
            ☁ NUVEM-AÍ
          </div>

          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 hover:bg-blue-500"
          >
            <Plus size={18} /> Nova conversa
          </button>

          <div className="mt-8 text-xs text-gray-500 uppercase">
            Conversas
          </div>

          {messages.length > 0 && (
            <div className="mt-4 text-sm text-gray-300 flex gap-2">
              <MessageSquare size={17} /> Conversa atual
            </div>
          )}

          <div className="mt-auto text-xs text-gray-500">
            NUVEM-AÍ · Inteligência artificial
          </div>
        </aside>
      )}

      <section className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center px-5 gap-4">
          <button onClick={() => setSidebar(!sidebar)}>
            <Menu />
          </button>
          <span className="font-semibold">NUVEM-AÍ</span>
          <span className="ml-auto text-xs text-blue-300 flex gap-2 items-center">
            <Sparkles size={15} /> Assistente inteligente
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Bot size={42} />
              </div>

              <h1 className="text-3xl font-bold mb-3">
                Olá! Eu sou a NUVEM-AÍ.
              </h1>

              <p className="text-gray-400">
                Sua inteligência artificial começa aqui.
              </p>

              <p className="text-sm text-gray-600 mt-3">
                O que vamos criar hoje?
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 py-5">
              {messages.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {item.role === "user" ? "U" : <Bot size={20} />}
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 max-w-[85%] whitespace-pre-wrap break-words">
                    {item.content || (loading ? "Pensando..." : "")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-[#151c33] border border-white/10 rounded-2xl p-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Pergunte alguma coisa à NUVEM-AÍ..."
              className="flex-1 bg-transparent outline-none text-white min-w-0"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
            >
              <Send size={19} />
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-3">
            NUVEM-AÍ pode cometer erros. Confira informações importantes.
          </p>
        </div>
      </section>
    </main>
  );
}
