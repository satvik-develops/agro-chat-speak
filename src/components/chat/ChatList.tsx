import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface ChatListProps {
  messages: ChatMessage[];
}

export const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!messages?.length) {
    return (
      <div className="text-center text-sm text-muted-foreground animate-fade-in">
        Start the conversation to see messages here.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((m, i) => {
        const isUser = m.role === "user";
        return (
          <li
            key={m.id}
            className={cn(
              "flex items-end gap-2 animate-fade-in",
              isUser ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
          >
            {!isUser && (
              <Avatar className="size-8 shrink-0 shadow-sm ring-1 ring-border">
                <AvatarFallback className="bg-muted text-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 shadow-soft ring-1 ring-border transition-all duration-300",
                isUser
                  ? "bg-primary text-primary-foreground hover:shadow-glow"
                  : "bg-muted text-foreground hover:shadow-glow"
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{m.content}</p>
            </div>

            {isUser && (
              <Avatar className="size-8 shrink-0 shadow-sm ring-1 ring-border">
                <AvatarFallback className="bg-primary/15 text-primary"><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
          </li>
        );
      })}
      <div ref={endRef} />
    </ul>
  );
};
