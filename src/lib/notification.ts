export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
};

export const showTimerNotification = (mode: string) => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const labels: Record<string, string> = {
    pomodoro: "Pomodoro",
    short_break: "Short Break",
    long_break: "Long Break",
  };

  new Notification("Productivity App", {
    body: `${labels[mode] || mode} timer is done!`,
    icon: "/vite.svg",
  });
};
