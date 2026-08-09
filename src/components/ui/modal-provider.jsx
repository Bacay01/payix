"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const resolverRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const close = useCallback((result) => {
    setModal(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  const alertFn = useCallback((message) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModal({ type: "alert", message });
    });
  }, []);

  const confirmFn = useCallback((message) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModal({ type: "confirm", message });
    });
  }, []);

  const promptFn = useCallback((message, defaultValue = "") => {
    setInputValue(defaultValue);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModal({ type: "prompt", message, defaultValue });
    });
  }, []);

  return (
    <ModalContext.Provider value={{ alert: alertFn, confirm: confirmFn, prompt: promptFn }}>
      {children}

      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-5 shadow-card">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                P
              </span>
              <p className="text-sm font-semibold">Payix</p>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm text-foreground">{modal.message}</p>

            {modal.type === "prompt" && (
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") close(inputValue);
                  if (e.key === "Escape") close(null);
                }}
                className="mt-4 h-11 w-full rounded-xl border border-border bg-secondary px-4 text-sm outline-none focus:border-accent"
              />
            )}

            <div className="mt-5 flex justify-end gap-2">
              {(modal.type === "confirm" || modal.type === "prompt") && (
                <button
                  onClick={() => close(modal.type === "prompt" ? null : false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => close(modal.type === "prompt" ? inputValue : true)}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}