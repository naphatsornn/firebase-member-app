import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [externalResult, setExternalResult] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setNotFound(false);
    setName(null);

    const q = query(collection(db, "users"), where("phone", "==", phone));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setNotFound(true);
    } else {
      const userData = snapshot.docs[0].data();
      setName(userData.name);
    }
  };

  const callExternalApi = async () => {
    const user = auth.currentUser;
    if (!user) return alert("ยังไม่ได้ล็อกอิน");

    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setExternalResult(data);
    } catch (err) {
      console.error("API ERROR:", err);
      setExternalResult({ error: "เรียก API ไม่สำเร็จ" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">ค้นหาสมาชิก</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mb-4"
        >
          ออกจากระบบ
        </button>

        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            placeholder="กรอกเบอร์โทร"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ค้นหา
          </button>
        </form>

        {name && (
          <p className="mt-4 text-green-600 font-semibold">
            ชื่อสมาชิก: {name}
          </p>
        )}
        {notFound && (
          <p className="mt-4 text-red-500">ไม่พบข้อมูล</p>
        )}

        <button
          onClick={callExternalApi}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          เรียก API ภายนอก
        </button>

        {externalResult && (
          <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(externalResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
