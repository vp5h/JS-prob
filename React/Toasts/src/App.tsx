// ToasterProvider.tsx
// React toaster with stacking, queueing, custom CSS (no Tailwind or Framer Motion)

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./styles.css";

type ToastType = "success" | "error" | "info" | "warning";
type Toast = {
  id: string;
  title?: string;
  message?: React.ReactNode;
  type?: ToastType;
  duration?: number;
};

type ToasterAPI = {
  push: (t: Omit<Toast, "id">) => string;
  success: (message: string, opts?: Partial<Toast>) => string;
  error: (message: string, opts?: Partial<Toast>) => string;
  info: (message: string, opts?: Partial<Toast>) => string;
  warning: (message: string, opts?: Partial<Toast>) => string;
  remove: (id: string) => void;
};

const ToasterContext = createContext<ToasterAPI | null>(null);

export function useToaster() {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error("useToaster must be used within ToasterProvider");
  return ctx;
}

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function ToasterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState<Toast[]>([]);
  const queueRef = useRef<Toast[]>([]);
  const maxVisible = 5;

  const push = (t: Omit<Toast, "id">) => {
    const id = makeId();
    const toast: Toast = { id, ...t };
    setVisible((cur) => {
      if (cur.length < maxVisible) return [...cur, toast];
      queueRef.current.push(toast);
      return cur;
    });
    return id;
  };

  const remove = (id: string) => {
    setVisible((cur) => {
      const next = cur.filter((t) => t.id !== id);
      if (next.length < maxVisible && queueRef.current.length > 0) {
        const nextToast = queueRef.current.shift()!;
        return [...next, nextToast];
      }
      return next;
    });
  };

  const success = (message: string, opts?: Partial<Toast>) =>
    push({ message, type: "success", duration: 4000, ...opts });
  const error = (message: string, opts?: Partial<Toast>) =>
    push({ message, type: "error", duration: 6000, ...opts });
  const info = (message: string, opts?: Partial<Toast>) =>
    push({ message, type: "info", duration: 3500, ...opts });
  const warning = (message: string, opts?: Partial<Toast>) =>
    push({ message, type: "warning", duration: 5000, ...opts });

  const value: ToasterAPI = { push, success, error, info, warning, remove };

  return (
    <ToasterContext.Provider value={value}>
      {children}

      <button
        className="toast-test-btn"
        onClick={() => {
          success("Saved successfully!");
          error("Something went wrong!");
          info("Here’s some info for you.");
          warning("Be careful!");
        }}
      >
        Test Toasts
      </button>

      <div className="toast-container">
        {visible.map((t) => (
          <ToastView key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

function ToastView({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { title, message, type = "info", duration = 4000 } = toast;
  const [isShown, setIsShown] = useState(true);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(duration);

  useEffect(() => {
    const enter = requestAnimationFrame(() => setIsShown(true));
    if (duration !== 0) startTimer(remainingRef.current);
    return () => {
      cancelAnimationFrame(enter);
      clearTimer();
    };
  }, []);

  function startTimer(ms: number) {
    startTimeRef.current = Date.now();
    clearTimer();
    timerRef.current = window.setTimeout(() => handleClose(), ms);
  }

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleMouseEnter() {
    if (duration === 0) return;
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    clearTimer();
  }

  function handleMouseLeave() {
    if (duration === 0) return;
    startTimer(remainingRef.current);
  }

  function handleClose() {
    setIsShown(false);
    setTimeout(() => onClose(), 200);
  }

  return (
    <div
      className={`toast ${type} ${isShown ? "toast-show" : "toast-hide"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
}
