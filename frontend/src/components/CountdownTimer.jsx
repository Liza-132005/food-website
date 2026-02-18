import { useEffect, useState } from "react";

export default function CountdownTimer({ estimatedTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(estimatedTime) - new Date();

      if (diff <= 0) {
        setTimeLeft("Arriving...");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  return <p>⏳ Delivery in: {timeLeft}</p>;
}
