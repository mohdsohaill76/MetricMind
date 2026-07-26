"use client";

import { useState } from "react";
import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

export default function AIChatPage() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Hello! I'm your MetricMind AI Business Assistant. Ask me anything about your business data, revenue, sales, customers, or performance.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Add user's message to chat
    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      text: userMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newUserMessage,
    ]);

    setMessage("");
    setLoading(true);

    /*
      BACKEND API WILL BE CONNECTED HERE.

      Example later:

      const response = await fetch(
        "http://localhost:8000/api/semantic/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
          }),
        }
      );

      const data = await response.json();

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now(),
          role: "ai",
          text: data.answer,
        },
      ]);
    */

    // Temporary frontend response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "Your question has been received. The real AI-powered response will appear here once the MetricMind backend API is connected.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);

      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">
              AI Business Assistant
            </h1>

            <p className="mt-2 text-gray-600">
              Ask questions about your business data and get
              AI-powered insights.
            </p>
          </div>

          {/* Chat Container */}
          <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-md">

            {/* Chat Header */}
            <div className="flex items-center gap-4 border-b p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <FaRobot className="text-2xl" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  MetricMind AI
                </h2>

                <p className="text-sm text-gray-500">
                  Conversational Business Intelligence
                </p>
              </div>

            </div>

            {/* Messages Area */}
            <div className="min-h-[500px] space-y-6 bg-slate-50 p-8">

              {messages.map((item) => (

                <div
                  key={item.id}
                  className={`flex items-start gap-3 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* AI Icon */}
                  {item.role === "ai" && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <FaRobot />
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`max-w-3xl rounded-2xl p-5 shadow-sm ${
                      item.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-800"
                    }`}
                  >
                    <p>{item.text}</p>
                  </div>

                  {/* User Icon */}
                  {item.role === "user" && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white">
                      <FaUser />
                    </div>
                  )}

                </div>

              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FaRobot />
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-gray-500">
                      MetricMind AI is analyzing your question...
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Chart Placeholder */}
            <div className="border-t bg-white p-6">

              <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 text-center">

                <FaChartLine className="mx-auto text-4xl text-blue-600" />

                <h3 className="mt-3 font-semibold text-slate-700">
                  Dynamic Business Visualization
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Charts will be generated dynamically from
                  backend API responses.
                </p>

              </div>

            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-6">

              <div className="flex gap-3">

                <input
                  type="text"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your business data..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                />

                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaPaperPlane />

                  {loading ? "Thinking..." : "Send"}
                </button>

              </div>

              <p className="mt-3 text-xs text-gray-400">
                Press Enter to send your question.
              </p>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}