import { ReactNode, useEffect } from "react";

export type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, closeModal, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.18)] sm:p-8">
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-8 right-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg font-semibold text-slate-500 transition hover:bg-slate-100"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
