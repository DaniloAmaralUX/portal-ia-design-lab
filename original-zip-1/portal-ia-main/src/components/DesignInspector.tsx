import { useContext, useState } from "react";
import { Ruler, SlidersHorizontal, X } from "lucide-react";
import { Mesurer } from "mesurer";
import { Button } from "@/components/ui/button";
import { CraftControlsContext } from "@/components/craft/craft-context";

// Keep the development toolbar out of the product until the reviewer asks for it.
export function DesignInspector() {
  const [open, setOpen] = useState(false);
  const openControls = useContext(CraftControlsContext);
  if (window.location.pathname.startsWith("/prototipos/")) return null;
  return (
    <>
      {open && <Mesurer shortcutsEnabled={false} />}
      <div className="fixed bottom-4 right-4 z-[80] flex items-center gap-2">
      {openControls && <Button size="sm" variant="outline" onClick={openControls} className="shadow-sm"><SlidersHorizontal aria-hidden />Ajustar movimento</Button>}
      <Button
        size="sm"
        variant="outline"
        aria-pressed={open}
        onClick={() => setOpen((value) => !value)}
        className="shadow-sm"
      >
        {open ? <X aria-hidden /> : <Ruler aria-hidden />}
        {open ? "Fechar inspetor" : "Medir interface"}
      </Button>
      </div>
    </>
  );
}
