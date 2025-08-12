import { useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import VoiceButton from "@/components/chat/VoiceButton";
import LiveVoiceOverlay from "@/components/chat/LiveVoiceOverlay";
import { Camera, SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLiveKitVoice } from "@/hooks/useLiveKitVoice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatList, ChatMessage } from "@/components/chat/ChatList";

const suggestions = [
  "Browse products",
  "Get farming advice",
  "Check my orders",
  "Ask about delivery",
];

const Index = () => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const userName = "Farmer"; // TODO: wire to auth/profile when available
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const { active, start, stop, subtitles, sendText, uploadImage } = useLiveKitVoice({ userName });

  const onSend = async () => {
    const text = message.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    await sendText(text);
    toast({ title: "Sent", description: "Your message was sent to AgriVoice." });
    setMessage("");

    // Placeholder assistant reply to render chat after sending
    const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "Got it! I’m on it." };
    setMessages((prev) => [...prev, botMsg]);
  };

  const onPickImage = () => fileInputRef.current?.click();
  const onImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
    toast({ title: "Image attached", description: file.name });
    e.target.value = ""; // reset
  };

  const onToggleVoice = async () => {
    if (active) await stop();
    else await start();
  };

  return (
    <>
      <Helmet>
        <title>AgriVoice Chat — AI Assistant for Agriculture</title>
        <meta name="description" content="Chat and speak to shop, plan, and get farming advice with real-time voice and subtitles." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/"} />
      </Helmet>

      <main className="ambient-bg min-h-screen px-4 py-10 md:py-14">
        <section className="mx-auto max-w-4xl rounded-3xl bg-card/60 p-6 backdrop-blur-[2px] ring-1 ring-border/60">
          <div className="text-center py-8 md:py-10">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight mb-3 leading-tight">
              {greeting}, {userName}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Can I help you with anything?</p>
          </div>

          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center">
            {suggestions.map((text) => (
              <Button key={text} variant="pill" className="text-xs sm:text-sm" onClick={() => setMessage(text)}>
                {text}
              </Button>
            ))}
          </div>

          <div className="mx-auto mb-6 max-w-3xl animate-fade-in">
            <ScrollArea className="h-[40vh] rounded-2xl border bg-card/60 p-4 shadow-soft">
              <ChatList messages={messages} />
            </ScrollArea>
          </div>

          <div className="relative mx-auto mb-6 max-w-3xl">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Type your message…"
              rows={4}
              className="w-full resize-none rounded-2xl border bg-card/90 p-4 pr-36 text-sm sm:text-base leading-relaxed shadow-soft transition-all duration-300 placeholder:text-sm sm:placeholder:text-base placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:shadow-glow focus-visible:border-primary/30"
            />

            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-end pb-2">
              <div className="pointer-events-auto flex items-center gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={onImageSelected}
                />
                <Button variant="outline" size="icon" aria-label="Attach image" onClick={onPickImage}>
                  <Camera />
                </Button>
                <VoiceButton active={active} onClick={onToggleVoice} />
                <Button variant="default" size="icon" aria-label="Send" onClick={onSend}>
                  <SendHorizontal />
                </Button>
              </div>
            </div>
          </div>

          <p className="mx-auto max-w-3xl text-center text-xs sm:text-sm text-muted-foreground">
            AgriVoice might make mistakes. Please double‑check important information.
          </p>
        </section>
      </main>

      <LiveVoiceOverlay open={active} subtitles={subtitles} onEnd={stop} />
    </>
  );
};

export default Index;
