import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenResponse, setTokenResponse] = useState(null);
  const [user, setUser] = useState(null); // ⬅️ เก็บ user ที่ login แล้ว

  // ✅ เข้าสู่ระบบแบบ email/password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login success");
      setUser(result.user); // ⬅️ เก็บ user ไว้ใช้ตอนส่ง token
    } catch (err) {
      console.error("❌ Login fail", err);
      setError(err.message);
    }
  };

  // ✅ ส่ง token ไป API หลัง login สำเร็จ
  const handleSendToken = async () => {
    if (!user) return alert("ยังไม่ได้ล็อกอิน");

    try {
      const token = await user.getIdToken(true); // ⬅️ refresh token
      const res = await fetch("/api/protected", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "tmn-access-token": token,
          "x-access-token": token,
        },
      });

      const data = await res.json();
      setTokenResponse(data);
      console.log("🎉 Token ส่งสำเร็จ:", data);
    } catch (err) {
      console.error("❌ ส่ง Token ไม่สำเร็จ", err);
      setTokenResponse({ error: "❌ ดึง token ไม่สำเร็จ" });
    }
  };

  // ✅ เข้าสู่ระบบแบบไม่ระบุตัวตน (anonymous)
  const handleAnonymousLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      const token = await result.user.getIdToken(true);

      const res = await fetch("/api/protected", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "tmn-access-token": token,
        },
      });

      const data = await res.json();
      setTokenResponse(data);
      console.log("✅ Anonymous Token ส่งสำเร็จ:", data);
    } catch (err) {
      console.error("❌ anonymous login fail", err);
      setTokenResponse({ error: "❌ anonymous login fail" });
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
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* ปุ่มส่ง Token แบบ login ปกติ */}
        <button
          onClick={handleSendToken}
          className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded"
        >
          ส่ง Token ไป API
        </button>

        {/* ปุ่ม login แบบ anonymous */}
        <button
          onClick={handleAnonymousLogin}
          className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded"
        >
          เข้าสู่ระบบแบบไม่ระบุตัวตน
        </button>

        {/* แสดงผล response จาก /api/protected */}
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
