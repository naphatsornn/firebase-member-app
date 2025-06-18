import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenResponse, setTokenResponse] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ ฟังก์ชันกดปุ่ม "ดึง Token ไป API"
  const handleGetToken = async () => {
    const user = auth.currentUser;
    if (!user) return alert("ยังไม่ได้ล็อกอิน");

    try {
      const token = await user.getIdToken(true); // 🔥 refresh token เสมอ
      const res = await fetch("/api/protected", {
        method: "GET",
        headers: {
          "authorization": `Bearer ${token}`,   // มาตรฐาน Firebase
          "tmn-access-token": token,            // custom header
          "x-access-token": token               // fallback อีกแบบ
        },
      });

      const data = await res.json();
      setTokenResponse(data);
      console.log("🎉 Token ส่งสำเร็จ:", data);
    } catch (err) {
      console.error("❌ ดึง token ไม่สำเร็จ", err);
      setTokenResponse({ error: "❌ ดึง token ไม่สำเร็จ" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <button
          onClick={handleGetToken}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          ดึง Token ไป API
        </button>

        {tokenResponse && (
          <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(tokenResponse, null, 2)}
          </pre>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
