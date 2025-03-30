import React, { useEffect, useState } from "react";
type Message = {
  message: string;
  time: string;
};
export default function App() {
  const [messageValue, setMessageValue] = useState<string>("");
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [messageList, setMessgeList] = useState<Message[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageValue) {
      return;
    }
    const messageSocket = {
      type: "send-message",
      data: messageValue,
    };
    socket?.send(JSON.stringify(messageSocket));
    setMessageValue("");
  };
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);

    return () => {
      socket.onclose = () => {
        console.log("Kết nối đóng lại");
      };
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onopen = () => {
      console.log("WebSocket Client Connected");

      socket.onmessage = ({ data }) => {
        const socketMessage = JSON.parse(data);
        if (socketMessage.type === "new-message") {
          const data = socketMessage.data;
          setMessgeList((messageList) => [...messageList, data]);
        }
      };
    };
  }, [messageList, socket]);

  return (
    <div>
      <div>
        {messageList.map((message, index) => (
          <div key={index}>
            <p>{message.message}</p>
            <p>{message.time}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nội dung..."
          value={messageValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessageValue(e.target.value)
          }
        />
        <button>Gửi</button>
      </form>
    </div>
  );
}
