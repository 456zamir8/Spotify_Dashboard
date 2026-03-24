const CLIENT_ID = "d3f93f2409af414e89140232fa91dbb3";
const REDIRECT_URI = "https://456zamir8.github.io/Spotify_Dashboard/";

function generateRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
}

async function generateCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const loginWithSpotify = async () => {
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: [
      "user-read-private",
      "user-read-email",
      "user-top-read",
      "user-read-recently-played",  // ← needed for last played
    ].join(" "),
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const handleSpotifyCallback = async (): Promise<string | null> => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return null;

  const verifier = localStorage.getItem("verifier");
  if (!verifier) {
    console.error("❌ No verifier found in localStorage");
    return null;
  }

  window.history.replaceState({}, "", window.location.pathname);

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("❌ Token exchange failed:", err);
    return null;
  }

  const data = await response.json();
  const token: string = data.access_token;

  localStorage.setItem("spotify_token", token);
  localStorage.removeItem("verifier");

  return token;
};

export const getStoredToken = (): string | null =>
  localStorage.getItem("spotify_token");

export const logout = () => {
  localStorage.removeItem("spotify_token");
  localStorage.removeItem("verifier");
};