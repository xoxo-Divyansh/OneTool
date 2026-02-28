"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
    } catch (err) {
      setError(`❌ Invalid JSON: ${err.message}`);
      setOutput("");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
    } catch (err) {
      setError(`❌ Invalid JSON: ${err.message}`);
      setOutput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        JSON Formatter
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <h2 className="mb-2 text-gray-300">Input JSON</h2>
          <textarea
            className="w-full h-[350px] p-4 bg-[#16181d] border border-gray-700 rounded-lg outline-none resize-none"
            placeholder="Paste your JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output */}
        <div>
          <h2 className="mb-2 text-gray-300">Formatted Output</h2>
          <textarea
            className="w-full h-[350px] p-4 bg-[#16181d] border border-gray-700 rounded-lg outline-none resize-none"
            value={output}
            readOnly
          />
        </div>
      </div>

      {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}

      <div className="flex gap-4 mt-6">
        <button
          onClick={formatJSON}
          className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
        >
          Format
        </button>

        <button
          onClick={minifyJSON}
          className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          Minify
        </button>
      </div>
    </div>
  );
}
