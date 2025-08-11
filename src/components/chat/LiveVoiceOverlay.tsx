import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";

interface LiveVoiceOverlayProps {
  open: boolean;
  subtitles?: string;
  onEnd: () => void;
}

const LiveVoiceOverlay = ({ open, subtitles, onEnd }: LiveVoiceOverlayProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">Live Voice</DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">You are connected. Speak naturally — we will transcribe in real time.</DialogDescription>
        </DialogHeader>

        <div className="flex items-end justify-center gap-1 py-6">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{ animationDelay: `${(i % 8) * 80}ms` }}
            />
          ))}
        </div>

        <div className="min-h-12 rounded-xl bg-accent/60 px-4 py-3 text-center text-xs sm:text-sm text-accent-foreground">
          {subtitles || "Listening…"}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="destructive" onClick={onEnd} className="rounded-full">
            <PhoneOff className="mr-2" /> End call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveVoiceOverlay;
