import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const VoiceButton = ({ active, onClick, className }: VoiceButtonProps) => {
  return (
    <Button
      aria-pressed={active}
      aria-label={active ? "Disable voice" : "Enable voice"}
      variant="voice"
      size="icon-xl"
      onClick={onClick}
      className={cn(active && "ring-2 ring-primary/40", className)}
    >
      <Mic className={cn(active ? "animate-pulse" : "")} />
      <span className="sr-only">Voice</span>
    </Button>
  );
};

export default VoiceButton;
