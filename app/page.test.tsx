import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Home Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch.mockResolvedValue({
            json: () => Promise.resolve({ results: [], duration: 0 }),
        });
    });

    it("renders the title", () => {
        render(<Home />);
        expect(screen.getByText(/SpeedSearch/)).toBeDefined();
    });

    it("updates input value on change", async () => {
        render(<Home />);
        const input = screen.getByPlaceholderText(
            /Start typing/,
        ) as HTMLInputElement;
        await act(async () => {
            fireEvent.change(input, { target: { value: "test" } });
        });
        expect(input.value).toBe("test");
    });

    it("performs search and displays results", async () => {
        mockFetch.mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    results: ["apple", "banana"],
                    duration: 10.5,
                }),
        });

        render(<Home />);
        const input = screen.getByPlaceholderText(/Start typing/);
        await act(async () => {
            fireEvent.change(input, { target: { value: "a" } });
        });

        await waitFor(() => {
            expect(screen.getByText("apple")).toBeDefined();
            expect(screen.getByText("banana")).toBeDefined();
            expect(screen.getByText("10.50ms")).toBeDefined();
        });
    });

    it("shows no results found message", async () => {
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ results: [], duration: 0 }),
        });

        render(<Home />);
        const input = screen.getByPlaceholderText(/Start typing/);
        await act(async () => {
            fireEvent.change(input, { target: { value: "xyz" } });
        });

        await waitFor(() => {
            expect(screen.getByText(/No results found/)).toBeDefined();
        });
    });
});
