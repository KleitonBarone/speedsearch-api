"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [input, setInput] = useState<string>("");
    const [_searchResult, setSearchResult] = useState<{
        results: string[];
        duration: number;
    }>({
        results: [],
        duration: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!input)
                return setSearchResult({
                    results: [],
                    duration: 0,
                });

            const result = await fetch(`/api/search?q=${input}`).then((res) =>
                res.json(),
            );

            setSearchResult({
                results: result.results,
                duration: result.duration,
            });
        };

        fetchData();
    }, [input]);

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search..."
                    className="
                        w-full
                        px-4
                        py-3
                        text-lg
                        rounded-xl
                        border-2
                        border-gray-300
                        dark:border-gray-600
                        bg-white/90
                        dark:bg-gray-800/90
                        text-gray-900
                        dark:text-gray-100
                        placeholder-gray-500
                        dark:placeholder-gray-400
                        backdrop-blur-sm
                        shadow-lg
                        shadow-gray-200/50
                        dark:shadow-gray-950/50
                        outline-none
                        transition-all
                        duration-200
                        focus:border-blue-500
                        dark:focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-500/20
                        dark:focus:ring-blue-400/20
                        hover:border-gray-400
                        dark:hover:border-gray-500
                    "
                />
            </div>
        </main>
    );
}
