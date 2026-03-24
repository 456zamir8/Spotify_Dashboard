import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  avatarUrl?: string;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout?: () => void;
  displayName?: string;
}

const Header: React.FC<HeaderProps> = ({
  avatarUrl,
  isLoggedIn,
  onLogin,
  onLogout,
  displayName,
}) => {
  const [open, setOpen] = useState(false);

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        right: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ color: "white", fontSize: "26px", fontWeight: 600 }}
      >
        {greeting}{displayName ? `, ${displayName.split(" ")[0]}` : ""}
      </motion.h1>

      {/* RIGHT SIDE */}
      {!isLoggedIn ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            color: "#000",
            background: "#1DB954",
          }}
        >
          Login with Spotify
        </motion.button>
      ) : (
        <div style={{ position: "relative" }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(!open)}
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <img
              src={avatarUrl || "https://i.pravatar.cc/100"}
              alt="User"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "60px",
                  right: 0,
                  width: "180px",
                  borderRadius: "12px",
                  padding: "10px",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
              >
                <div style={menuItem}>Profile</div>
                <div style={menuItem}>Settings</div>
                <div
                  style={{ ...menuItem, color: "#ff6b6b" }}
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                >
                  Logout
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const menuItem: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

export default Header;