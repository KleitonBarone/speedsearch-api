"use client";

import { useEffect, useState } from "react";
import { ChevronRightIcon } from "./components/icons/ChevronRightIcon";
import { ClockIcon } from "./components/icons/ClockIcon";
import { SearchIcon } from "./components/icons/SearchIcon";

export default function Home() {
    const [input, setInput] = useState<string>("");
    const [results, setResults] = useState<string[]>([]);
    const [duration, setDuration] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!input) {
            setResults([]);
            setDuration(0);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/search?q=${encodeURIComponent(input)}`,
                    { signal }
                );
                const data = await response.json();

                setResults(data.results || []);
                setDuration(data.duration ?? 0);
            } catch (err) {
                console.error("Failed to fetch results", err);
                setResults([]);
                setDuration(0);
            } finally {
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [input]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 selection:bg-blue-500/30">
            <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                </div>
            </nav>

            <main className="container mx-auto max-w-3xl flex flex-col items-center pt-32 pb-20 px-4 min-h-screen">
                <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                            SpeedSearch ⚡
                        </span>
                    </h1>
                </div>

                <div className="w-full relative group z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>

                    <div className="relative flex items-center bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-blue-500/5 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50">
                        <div className="pl-6 text-zinc-400">
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                            ) : (
                                <SearchIcon className="w-6 h-6" />
                            )}
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setIsLoading(true);
                                setInput(e.target.value);
                            }}
                            placeholder="Start typing to search..."
                            className="w-full bg-transparent border-none px-4 py-5 text-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-0"
                            spellCheck={false}
                            // biome-ignore lint/a11y/noAutofocus: Search is the primary action
                            autoFocus
                        />

                        <div
                            className={`mr-4 transition-opacity duration-300 ${duration > 0 ? "opacity-100" : "opacity-0"}`}
                        >
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 select-none">
                                <ClockIcon className="w-3.5 h-3.5" />
                                <span>{duration.toFixed(2)}ms</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-8 space-y-4">
                    {results.length > 0 ? (
                        <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <div className="px-2 text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                Found {results.length} result
                                {results.length !== 1 ? "s" : ""}
                            </div>
                            {results.map((result) => (
                                <div
                                    key={result}
                                    className="group p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-default flex items-center justify-between"
                                >
                                    <span className="text-lg text-zinc-700 dark:text-zinc-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {result}
                                    </span>
                                    <ChevronRightIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        input && !isLoading && (
                            <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/50 mb-4">
                                    <SearchIcon className="w-8 h-8 text-zinc-400" />
                                </div>
                                <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-1">
                                    No results found
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    We couldn't find anything matching "{input}"
                                </p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
