const BASE_URL = "http://localhost:5000";

export const api = async (url, method = "GET", body, token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(BASE_URL + url, options);
    
    // Check if unauthorized, trigger potential logout in higher context if needed
    if (res.status === 401) {
      // LocalStorage cleanup could be done here or in AuthContext
    }

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (err) {
    console.error("API Call Error:", err);
    return { ok: false, data: { message: "Network connection failed" } };
  }
};