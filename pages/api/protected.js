export default function handler(req, res) {
  const headers = req.headers;

  const token =
    headers["tmn-access-token"] ||
    headers["x-access-token"] ||
    (headers["authorization"]?.startsWith("Bearer ")
      ? headers["authorization"].split("Bearer ")[1]
      : null);
      console.log("🔥 Token from header:", token);
  
      console.log("🔥 Raw Token Candidates:", {
    "tmn-access-token": headers["tmn-access-token"],
    "x-access-token": headers["x-access-token"],
    authorization: headers["authorization"],
  });

  return res.status(token ? 200 : 401).json({
    message: token ? "✅ Token received" : "❌ Token not found",
    token,
    allHeaders: headers,
  });
}
