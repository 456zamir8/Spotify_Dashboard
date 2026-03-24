import './index.css'

import { useEffect, useState } from "react";
import {
  loginWithSpotify,
  handleSpotifyCallback,
  getStoredToken,
  logout,
} from "./data/auth";

import Header from "./components/Header";
import Grainient from './components/Grainient';
import TiltedCard from './components/TiltedCard';

function LoginPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <Grainient
          color1="#0B0F0C" color2="#1DB954" color3="#191414"
          timeSpeed={0.25} colorBalance={0} warpStrength={1}
          warpFrequency={5} warpSpeed={2} warpAmplitude={50}
          blendAngle={0} blendSoftness={0.05} rotationAmount={500}
          noiseScale={2} grainAmount={0.1} grainScale={2}
          grainAnimated={false} contrast={1.5} gamma={1}
          saturation={1} centerX={0} centerY={0} zoom={0.9}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "48px 40px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          textAlign: "center",
          maxWidth: "360px",
          width: "90%",
        }}
      >
        <svg width="56" height="56" viewBox="0 0 168 168">
          <path fill="#1DB954" d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.6 121.2c-1.5 2.5-4.7 3.3-7.2 1.8-19.7-12-44.5-14.7-73.7-8-2.8.6-5.6-1.1-6.2-3.9-.6-2.8 1.1-5.6 3.9-6.2 31.9-7.3 59.3-4.2 81.4 9.2 2.5 1.5 3.3 4.7 1.8 7.1zm10.3-22.9c-1.9 3.1-5.9 4.1-9 2.2-22.5-13.8-56.8-17.8-83.4-9.8-3.4 1-7-1-8-4.4s1-7 4.4-8c30.4-9.2 68.2-4.8 94 11.2 3.1 1.9 4.1 5.9 2 9zm.9-23.8c-27-16-71.5-17.5-97.3-9.7-4.1 1.2-8.4-1.1-9.6-5.2-1.2-4.1 1.1-8.4 5.2-9.6 29.5-9 78.6-7.2 109.6 11.2 3.7 2.2 4.9 7 2.7 10.7-2.1 3.6-7 4.9-10.6 2.6z" />
        </svg>

        <div>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: 700, margin: 0 }}>
            Spotify Dashboard
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "8px" }}>
            Connect your account to see your stats
          </p>
        </div>

        <button
          onClick={loginWithSpotify}
          style={{
            padding: "14px 32px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "15px",
            color: "#000",
            background: "#1DB954",
            width: "100%",
          }}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

function Dashboard({ profile, onLogout }: { profile: any; onLogout: () => void }) {
  return (
    <>
      <div style={{ width: "100%", height: "100vh", position: "fixed", inset: 0, zIndex: 0 }}>
        <Grainient
          color1="#0B0F0C" color2="#1DB954" color3="#191414"
          timeSpeed={0.25} colorBalance={0} warpStrength={1}
          warpFrequency={5} warpSpeed={2} warpAmplitude={50}
          blendAngle={0} blendSoftness={0.05} rotationAmount={500}
          noiseScale={2} grainAmount={0.1} grainScale={2}
          grainAnimated={false} contrast={1.5} gamma={1}
          saturation={1} centerX={0} centerY={0} zoom={0.9}
        />
      </div>

      <Header
        isLoggedIn={true}
        avatarUrl={profile?.images?.[0]?.url}
        onLogin={loginWithSpotify}
        onLogout={onLogout}
        displayName={profile?.display_name}
      />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, padding: "100px 20px 40px" }}>
        <div className="fixed top-25 right-5 z-10">
          <TiltedCard
            imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
            altText="Kendrick Lamar - GNX Album Cover"
            captionText="Kendrick Lamar - GNX"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={26}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip
            displayOverlayContent
            overlayContent={<p className="tilted-card-demo-text">Kendrick Lamar - GNX</p>}
          />
        </div>
      </div>
    </>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const urlCode = new URLSearchParams(window.location.search).get("code");
      let activeToken: string | null = null;

      if (urlCode) {
        activeToken = await handleSpotifyCallback();
      } else {
        activeToken = getStoredToken();
      }

      if (activeToken) setToken(activeToken);
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { handleLogout(); return null; }
        return res.json();
      })
      .then((data) => { if (data) setProfile(data); })
      .catch(console.error);
  }, [token]);

  const handleLogout = () => {
    logout();
    setToken(null);
    setProfile(null);
  };

  if (loading) return <div style={{ width: "100vw", height: "100vh", background: "#0B0F0C" }} />;
  if (!token || !profile) return <LoginPage />;
  return <Dashboard profile={profile} onLogout={handleLogout} />;
}

export default App;