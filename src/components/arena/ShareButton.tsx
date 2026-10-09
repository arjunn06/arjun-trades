import { ShareNetwork } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ARENA_URL = "https://ifvg.in/arena";
const SHARE_TEXT =
  "Ultimate IFVG Arena: a one-week paper trading league where the community's ₹99s pay for the winner's Apex activation fee.";

/** Native share sheet where it exists, clipboard otherwise. */
const ShareButton = ({ className }: { className?: string }) => {
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Ultimate IFVG Arena", text: SHARE_TEXT, url: ARENA_URL });
        return;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // person closed the sheet
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${ARENA_URL}`);
      toast({ title: "Link copied", description: "Send it to someone who deserves this shot." });
    } catch {
      toast({ title: "Couldn't copy", description: ARENA_URL });
    }
  };

  return (
    <Button type="button" size="lg" variant="outline" onClick={share} className={className}>
      <ShareNetwork weight="bold" />
      Share the Arena
    </Button>
  );
};

export default ShareButton;
