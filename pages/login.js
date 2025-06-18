import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenResponse, setTokenResponse] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ เข้าสู่ระบบปกติ
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      console.log("✅ Login success");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ เข้าสู่ระบบแบบไม่ระบุตัวตน (anonymous)
  const handleAnonymousLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      setUser(result.user);
      console.log("✅ Anonymous login success");
    } catch (err) {
      console.error("❌ anonymous login fail", err);
      setError("anonymous login fail");
    }
  };

  // ✅ ส่ง token ไปยัง /api/protected
  const handleSendToken = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("ยังไม่ได้ล็อกอิน");
      return;
    }

    const token = await currentUser.getIdToken(true);

    const res = await fetch("/api/protected", {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
        "tmn-access-token": token,
        "x-access-token": token,
      },
    });

    const data = await res.json();
    console.log("🎉 ส่ง token สำเร็จ:", data);
    setTokenResponse(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>

        {/* ✅ Form login ปกติ */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-4 py-2"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* ✅ ปุ่ม login แบบไม่ระบุตัวตน */}
        <button
          onClick={handleAnonymousLogin}
          className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded"
        >
          เข้าสู่ระบบแบบไม่ระบุตัวตน
        </button>

        {/* ✅ ปุ่มยิง token ไป API */}
        <button
          onClick={handleSendToken}
          className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded"
        >
          ส่ง Token ไป API
        </button>

        {/* ✅ แสดงผลลัพธ์ */}
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
