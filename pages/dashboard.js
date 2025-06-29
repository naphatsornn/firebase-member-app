import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [externalResult, setExternalResult] = useState(null);

  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [addMessage, setAddMessage] = useState(null);

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

  const fetchTokenFromHeader = async () => {
    const user = auth.currentUser;
    if (!user) return alert("ยังไม่ได้ล็อกอิน");

    try {
      const token = await user.getIdToken(true); // 🔥 force refresh
      const res = await fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("✅ Token response:", data);
      setExternalResult(data);
    } catch (err) {
      console.error("❌ ERROR:", err);
      setExternalResult({ error: "เรียก API ไม่สำเร็จ" });
    }
  };

  const handleAddMember = async () => {
    if (!newPhone || !newName) {
      return setAddMessage("❌ กรุณากรอกชื่อและเบอร์ให้ครบ");
    }

    try {
      await setDoc(doc(db, "users", newPhone), {
        phone: newPhone,
        name: newName,
      });
      setAddMessage("✅ เพิ่มสมาชิกสำเร็จ");
      setNewPhone("");
      setNewName("");
    } catch (err) {
      console.error(err);
      setAddMessage("❌ เพิ่มสมาชิกไม่สำเร็จ");
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
        {notFound && <p className="mt-4 text-red-500">ไม่พบข้อมูล</p>}

        <button
          onClick={fetchTokenFromHeader}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          ดึง Token จาก Header
        </button>

        {externalResult && (
          <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(externalResult, null, 2)}
          </pre>
        )}

        <hr className="my-6" />
        <h2 className="text-xl font-semibold text-center mb-2">
          เพิ่มสมาชิกใหม่
        </h2>
        <input
          type="text"
          placeholder="เบอร์โทรใหม่"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
        />
        <input
          type="text"
          placeholder="ชื่อสมาชิกใหม่"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
        />
        <button
          onClick={handleAddMember}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          เพิ่มสมาชิก
        </button>
        {addMessage && (
          <p className="mt-2 text-center text-sm text-gray-700">
            {addMessage}
          </p>
        )}
      </div>
    </div>
  );
}
