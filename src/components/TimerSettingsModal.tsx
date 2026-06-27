import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog } from "radix-ui";
import { Settings, X } from "lucide-react";
import type { TimerSettings } from "@/types/timer";

type Props = {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
};

const TimerSettingsModal = ({ settings, onSave }: Props) => {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(settings);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(local);
    setOpen(false);
    toast.success("Settings saved");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          title="Timer settings"
        >
          <Settings size={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-sm p-6 dark:bg-card dark:border-border">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-white">
              Timer Settings
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pomodoro (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={local.pomodoro}
                onChange={(e) =>
                  setLocal({ ...local, pomodoro: Number(e.target.value) || 1 })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-muted dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Break (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={local.shortBreak}
                onChange={(e) =>
                  setLocal({ ...local, shortBreak: Number(e.target.value) || 1 })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-muted dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Long Break (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={local.longBreak}
                onChange={(e) =>
                  setLocal({ ...local, longBreak: Number(e.target.value) || 1 })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-muted dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TimerSettingsModal;
