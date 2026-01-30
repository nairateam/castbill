"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <main>
      <h1>CastBill</h1>
      {user ? <p>Logged in</p> : <p>Not logged in</p>}
    </main>
  );
}
