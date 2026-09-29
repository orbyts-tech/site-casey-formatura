"use client";

import { useCallback, useState } from "react";

type DownloadStatus = "idle" | "preparing" | "failed";

interface ElementImageDownload {
  readonly status: DownloadStatus;
  readonly downloadImage: () => Promise<void>;
}

interface ElementImageDownloadOptions {
  readonly elementId: string;
  readonly fileName: string;
  readonly backgroundColor: string;
}

const EXPORT_PIXEL_RATIO = 3;

export function useElementImageDownload({
  elementId,
  fileName,
  backgroundColor,
}: ElementImageDownloadOptions): ElementImageDownload {
  const [status, setStatus] = useState<DownloadStatus>("idle");

  const downloadImage = useCallback(async () => {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      setStatus("failed");
      return;
    }

    setStatus("preparing");
    try {
      const { toPng } = await import("html-to-image");
      const imageDataUrl = await toPng(targetElement, {
        pixelRatio: EXPORT_PIXEL_RATIO,
        backgroundColor,
        cacheBust: true,
      });

      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = imageDataUrl;
      downloadAnchor.download = fileName;
      downloadAnchor.click();
      setStatus("idle");
    } catch (error) {
      console.error("Falha ao gerar a imagem do Save the Date", error);
      setStatus("failed");
    }
  }, [backgroundColor, elementId, fileName]);

  return { status, downloadImage };
}
