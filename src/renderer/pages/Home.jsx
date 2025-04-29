import React from "react";

export default function Home({ token }) {
    return (
      <div style={{ color: '#fff', padding: 32 }}>
        <h2>Welcome 🎉</h2>
        <p>You are signed in with Google.</p>
        <pre>{token?.slice(0, 40)}…</pre>
      </div>
    );
  }
  