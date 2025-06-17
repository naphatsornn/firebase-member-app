// pages/index.js
// pages/index.js
export { default } from "./login";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return null;
}
