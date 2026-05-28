import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { CalendarView } from "./components/CalendarView";

function IntroPage({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onStart();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div className="w-[393px] h-[852px] flex items-center justify-center bg-background mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">틈</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          서로 바쁜 일정 속에서<br />같이 만날 수 있는 틈
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(stored);
      setShowIntro(false);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setShowIntro(false);
    localStorage.setItem("currentUser", username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowIntro(false);
    localStorage.removeItem("currentUser");
  };

  if (!currentUser && showIntro) {
    return <IntroPage onStart={() => setShowIntro(false)} />;
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <CalendarView currentUser={currentUser} onLogout={handleLogout} />;
}
