import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [externalResult, setExternalResult] = useState(null); // ⭐ สำหรับแสดงผล Token

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

  // ⭐ เพิ่มฟังก์ชันดึง Token จาก header (เช่นจาก Proxyman / mini app)
  const fetchTokenFromHeader = async () => {
    try {
      const res = await fetch("/api/protected");
      const data = await res.json();
      console.log("✅ Token response:", data);
      setExternalResult(data);
    } catch (err) {
      console.error("❌ ERROR:", err);
      setExternalResult({ error: "เรียก API ไม่สำเร็จ" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
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

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* ⭐ ปุ่มดึง token จาก header */}
        <button
          onClick={fetchTokenFromHeader}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          ดึง Token จาก Header
        </button>

        {/* ⭐ แสดงผล Token / Error */}
        {externalResult && (
          <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(externalResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
