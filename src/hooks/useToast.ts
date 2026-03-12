import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState({ message: "", key: 0 });

  const showToast = (message: string) =>
    setToast((prev) => ({ message, key: prev.key + 1 }));

  return { toast, showToast };
}
