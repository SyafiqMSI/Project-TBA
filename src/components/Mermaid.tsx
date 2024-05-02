import { CircleHelp, Clipboard, ClipboardCheck } from "lucide-react";
import mermaid from "mermaid";
import Link from "next/link";
import { useEffect } from "react";
import useClipboard from "react-use-clipboard";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

mermaid.initialize({
  securityLevel: "loose",
  theme: "default",
});

export default function MermaidComponent({
  chart,
  id,
}: {
  chart: string;
  id: string;
}) {
  const [isCopied, setCopied] = useClipboard(chart);
  const { toast } = useToast();

  useEffect(() => {
    if (isCopied) {
      toast({
        title: "Berhasil!",
        description: "Kode state diagram berhasil disalin ke clipboard!",
      });
    }
  }, [isCopied]);

  useEffect(() => {
    document.getElementById(id)?.removeAttribute("data-processed");
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
      <div className="mermaid justify-center flex py-8" id={id}>
        {chart}
      </div>
  );
}
