import './index.css'

import React, { useEffect, useState } from "react";
import { loginWithSpotify } from "./data/auth";

import Header from "./components/Header";
import Grainient from './components/Grainient';
import TiltedCard from './components/TiltedCard';

function App() {

  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Parse token from URL hash
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const accessToken = params.get("access_token");

      if (accessToken) {
        console.log("✅ TOKEN RECEIVED:", accessToken); // 👈 DEBUG HERE
        setToken(accessToken);
        window.location.hash = "";
      } else {
        console.log("❌ NO TOKEN FOUND");
      }
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!token) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ PROFILE DATA:", data); // 👈 DEBUG HERE
        setProfile(data);
      })
      .catch((err) => {
        console.log("❌ ERROR:", err);
      });
  }, [token]);


  return (
    <>
      <p style={{ color: "white", position: "fixed", bottom: "10px", left: "10px" }}>
        {token ? "✅ Token OK" : "❌ No Token"} |{" "}
        {profile ? "✅ Profile Loaded" : "❌ No Profile"}
      </p>
      
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Grainient
          color1="#0B0F0C"
          color2="#1DB954"
          color3="#191414"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Header */}
      <Header
        isLoggedIn={!!profile}
        avatarUrl={profile?.images?.[0]?.url}
        onLogin={loginWithSpotify}
      />

      {/* Tilted Card */}
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
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
        />
      </div>
    </>
  )
}

export default App
