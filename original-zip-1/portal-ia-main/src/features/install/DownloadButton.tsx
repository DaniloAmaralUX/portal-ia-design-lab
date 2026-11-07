import { Download as DownloadIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { formatSize, type Download } from "./downloads";

export function DownloadButton({
  download,
  children = "Baixar .zip",
  variant = "outline",
  ...props
}: Omit<ButtonProps, "asChild"> & { download: Download }) {
  return (
    <Button asChild variant={variant} {...props}>
      <a href={download.url} download={download.name}>
        <DownloadIcon data-icon="inline-start" />
        {children}
        <span className="font-normal text-muted-foreground">{formatSize(download.size)}</span>
      </a>
    </Button>
  );
}
