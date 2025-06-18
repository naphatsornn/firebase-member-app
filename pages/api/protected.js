export const config = {
  runtime: "edge", // ✅ ใช้ Edge Runtime
};

export default async function handler(req) {
  const headers = req.headers;

  const token =
    headers["tmn-access-token"] ||
    headers["x-access-token"] ||
    (headers["authorization"]?.startsWith("Bearer ")
      ? headers["authorization"].split("Bearer ")[1]
      : null);

  return new Response(
    JSON.stringify({
      message: token ? "✅ Token received" : "❌ Token not found",
      token,
      allHeaders: headers,
    }),
    {
      status: token ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
console.log("🔥 Raw Token Candidates:", {
  "tmn-access-token": headers["tmn-access-token"],
  "x-access-token": headers["x-access-token"],
  authorization: headers["authorization"],
});
