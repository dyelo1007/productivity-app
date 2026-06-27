import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
};

const AddEditModal = ({ isOpen, onClose, onSave }: Props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setText("");
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim());
    setText("");
  };

  const handleClose = () => {
    setText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8 relative dark:bg-card dark:border-border">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-card-foreground">
          Add New Task
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-card-foreground">
            Task Title
          </label>
          <input
            type="text"
            placeholder="Add a new ToDo"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AddEditModal;
