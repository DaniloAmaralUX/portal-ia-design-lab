import { Toaster } from "sonner";
import { useUi } from "@/store/ui";

export function AppToaster() {
  const theme = useUi((s) => s.theme);
  return (
    <Toaster
      theme={theme}
      position="bottom-center"
      duration={5000}
      containerAriaLabel="Avisos"
      toastOptions={{
        closeButtonAriaLabel: "Fechar aviso",
        classNames: {
          // sonner draws the toast focus as a shadow and !shadow-lg erased it, so the focus comes back as an outline, like the rest of the site.
          toast:
            "!rounded-2xl !border-border !bg-popover !text-popover-foreground !shadow-lg !font-sans focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-ring",
          closeButton: "!size-6 !border-border !bg-popover !text-muted-foreground hover:!text-foreground",
        },
      }}
    />
  );
}
