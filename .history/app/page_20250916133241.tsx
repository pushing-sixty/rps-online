import { useState, useEffect } from "react";

export default function Home() {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    socket.onopen = () => setStatus("Connected! Make your move.");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) setStatus(data.status);
      else setResult(data);
    };
    socket.onclose = () => setStatus("Disconnected");
    setWs(socket);
    return () => socket.close();
  }, []);

  const play = (choice) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ choice }));
      setStatus("Waiting for opponent...");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Rock Paper Scissors (WebSocket)</h1>
      <p>{status}</p>
      <div>
        <button onClick={() => play("rock")}>Rock</button>
        <button onClick={() => play("paper")}>Paper</button>
        <button onClick={() => play("scissors")}>Scissors</button>
      </div>
      {result && (
        <div style={{ marginTop: "20px" }}>
          <p>Your Choice: {result.yourChoice}</p>
          <p>Opponent Choice: {result.opponentChoice}</p>
          <h2>Result: {result.result}</h2>
        </div>
      )}
    </div>
  );
}
