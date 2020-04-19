import { useEffect } from "react";


export function useRandomTestMessage(setMessages) {
  return useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessages((m) => [
        ...m,
        { message: `random message ${new Date().toISOString()}`, type: "info" },
      ]);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setMessages]);
}