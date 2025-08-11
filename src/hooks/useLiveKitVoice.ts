import { useCallback, useEffect, useRef, useState } from "react";
// LiveKit client types
import type { Room } from "livekit-client";

interface UseLiveKitVoiceOptions {
  userName?: string;
}

export function useLiveKitVoice({ userName }: UseLiveKitVoiceOptions = {}) {
  const [active, setActive] = useState(false);
  const [subtitles, setSubtitles] = useState<string>("");
  const roomRef = useRef<Room | null>(null);

  // Placeholder: connect to LiveKit using a server-generated token
  const start = useCallback(async () => {
    try {
      // You will need to request a server-signed token and connect:
      // const room = new Room();
      // await room.connect(LIVEKIT_WS_URL, token);
      // roomRef.current = room;
      // TODO: publish microphone track, setup STT events and subtitles stream
      setActive(true);
    } catch (err) {
      console.error("LiveKit start error", err);
      setActive(false);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      roomRef.current?.disconnect();
      roomRef.current = null;
    } finally {
      setActive(false);
    }
  }, []);

  const sendText = useCallback(async (text: string) => {
    // Example: trigger your backend agent via LiveKit data channel or HTTP
    console.log("sendText ->", text);
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    // Example: upload to storage and notify your agent
    console.log("uploadImage ->", file.name, file.type, file.size);
  }, []);

  // Demo subtitles ticker when active (remove once wired to STT)
  useEffect(() => {
    if (!active) return;
    const chunks = [
      "Listening…",
      "Processing your question…",
    ];
    let i = 0;
    const id = setInterval(() => {
      setSubtitles(chunks[i % chunks.length]);
      i++;
    }, 1500);
    return () => clearInterval(id);
  }, [active]);

  return { active, start, stop, subtitles, sendText, uploadImage, userName };
}
