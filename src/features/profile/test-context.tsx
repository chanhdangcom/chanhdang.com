"use client";

import { Button } from "@/components/button-new";
import { useCount } from "@/store/count";
import { useUser } from "@/store/user";
// import { useAudio } from "@/components/music-provider";

export function TestContext() {
  // const { count, handleUpdateCount } = useAudio();

  const [count, setCount] = useCount();
  const [user, setUser] = useUser();

  console.log("Render TestContext");

  return (
    <div>
      <div>{count}</div>
      <div>{user?.email}</div>

      <Button variant="success" onClick={() => setCount(count + 1)}>
        Inc count
      </Button>

      <input
        className="bg-zinc-900"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <input
        className="bg-zinc-900"
        value={user.fullName}
        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
      />
    </div>
  );
}
