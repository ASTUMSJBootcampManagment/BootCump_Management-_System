import { useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X
} from "lucide-react";

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      box: "bg-white border-emerald-200",
      icon: "bg-emerald-50 text-emerald-600",
      title: "text-emerald-700",
      Icon: CheckCircle2,
      titleText: "Success"
    },
    error: {
      box: "bg-white border-red-200",
      icon: "bg-red-50 text-red-600",
      title: "text-red-700",
      Icon: AlertCircle,
      titleText: "Error"
    },
    info: {
      box: "bg-white border-blue-200",
      icon: "bg-blue-50 text-blue-600",
      title: "text-blue-700",
      Icon: Info,
      titleText: "Information"
    }
  };

  const current = styles[type] || styles.success;
  const Icon = current.Icon;

  return (
    <div className="fixed top-5 right-5 z-[9999] w-[min(420px,calc(100vw-2rem))]">
      <div
        className={`flex items-start gap-3 rounded-2xl border shadow-2xl p-4 ${current.box}`}
      >
        <div
          className={`w-10 h-10 shrink-0 rounded-xl grid place-items-center ${current.icon}`}
        >
          <Icon size={19} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-black text-sm ${current.title}`}>
            {current.titleText}
          </p>

          <p className="text-sm text-slate-600 mt-1 break-words">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}