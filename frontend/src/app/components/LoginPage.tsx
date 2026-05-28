import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("모든 필드를 입력해주세요");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (isSignUp) {
      if (users[username]) {
        setError("이미 존재하는 사용자명입니다");
        return;
      }
      users[username] = { password, createdAt: new Date().toISOString() };
      localStorage.setItem("users", JSON.stringify(users));
      onLogin(username);
    } else {
      if (!users[username] || users[username].password !== password) {
        setError("사용자명 또는 비밀번호가 올바르지 않습니다");
        return;
      }
      onLogin(username);
    }
  };

  return (
    <div className="w-[393px] h-[852px] flex flex-col justify-center bg-background px-8 mx-auto">
      <div className="w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{isSignUp ? "회원가입" : "로그인"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자명을 입력하세요"
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="h-12"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full h-12">
            {isSignUp ? "가입하기" : "로그인"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full h-12"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp
              ? "이미 계정이 있으신가요? 로그인"
              : "계정이 없으신가요? 가입하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
