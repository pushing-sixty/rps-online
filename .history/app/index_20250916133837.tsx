import { useState, useEffect } from "react";

type Result = {
  yourChoice: string;
  opponentChoice: string;
  result: "win" | "lose" | "draw";
};

export default function RpsOnline() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    
    socket.onopen = () => setStatus("Connected! Make your move.");
    
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as Partial<Result> & { status?: string };
      if (data.status) setStatus(data.status);
      else setResult(data as Result);
    };
    
    socket.onclose = () => setStatus("Disconnected");
    setWs(socket);

    return () => socket.close();
  }, []);

  const play = (choice: "rock" | "paper" | "scissors") => {
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
