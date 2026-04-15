"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer } from "lucide-react";
import {
  AdmissionPrintData,
  AdmissionPrintPreview,
} from "@/components/forms/AdmissionPrintPreview";

const STORAGE_KEY = "admission-preview-data";

export default function AdmissionPreviewPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AdmissionPrintData | null>(null);
  const [savingPdf, setSavingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = window.sessionStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      router.replace("/dashboard?tab=forms");
      return;
    }

    try {
      setData(JSON.parse(storedData) as AdmissionPrintData);
    } catch {
      router.replace("/dashboard?tab=forms");
    }
  }, [router]);

  const handlePrint = () => window.print();

  const handleSavePdf = async () => {
    if (!printRef.current || savingPdf) return;

    setSavingPdf(true);
    setPdfError(null);

    try {
      if (document.fonts?.ready) await document.fonts.ready;

      /* Collect the outer page wrappers (.admission-print-page).
         Each one maps to one PDF page. */
      const pageEls = Array.from(
        printRef.current.querySelectorAll(".admission-print-page")
      ) as HTMLElement[];

      if (pageEls.length === 0) throw new Error("No printable pages found");

      const [html2canvasModule, jspdfModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const h2c = (html2canvasModule as any).default ?? html2canvasModule;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const JsPDF = (jspdfModule as any).jsPDF ?? (jspdfModule as any).default;
      if (!h2c || !JsPDF) throw new Error("Libraries could not be loaded");

      const pdf = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Expert-Level Fix: Wait for fonts AND add a physical buffer for the DOM to stabilize
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 500));

      for (let i = 0; i < pageEls.length; i++) {
        const snapshot = await h2c(pageEls[i], {
          scale: 4, // Max sharpness for professional print
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: 595,
          height: 842,
          windowWidth: 595,
          windowHeight: 842,
          onclone: (_doc: Document, clonedEl: HTMLElement) => {
            clonedEl.style.overflow = "visible";
            clonedEl.style.width = "595px";
            clonedEl.style.height = "842px";
            clonedEl.style.margin = "0";
            clonedEl.style.padding = "0";
            clonedEl.style.setProperty("-webkit-font-smoothing", "antialiased");
            clonedEl.style.setProperty("-moz-osx-font-smoothing", "grayscale");

            const inner = clonedEl.querySelector(".admission-print-canvas") as HTMLElement | null;
            if (inner) {
              inner.style.transform = "none";
              inner.style.transformOrigin = "top left";
              inner.style.position = "absolute";
              inner.style.top = "0";
              inner.style.left = "0";
              inner.style.width = "595px";
              inner.style.height = "842px";
            }
          },
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(snapshot.toDataURL("image/png"), "PNG", 0, 0, 210, 297, undefined, 'FAST');
      }

      const fileName = `${data?.firstName || "student"}-${data?.lastName || "admission"}-form.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF save failed:", err);
      setPdfError("PDF save nahi ho saki. Dobara try karein.");
    } finally {
      setSavingPdf(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-3 print:bg-white print:p-0">
      {/* ── Top action bar ── */}
      <div className="mx-auto flex w-full max-w-[820px] items-center justify-between gap-4 pb-3 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1F1F1F] transition-all hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePdf}
            disabled={savingPdf}
            className="flex items-center gap-2 rounded-lg border border-[#0A024B] bg-white px-5 py-2.5 text-sm font-semibold text-[#0A024B] transition-all hover:bg-[#f5f7ff] disabled:opacity-60 cursor-pointer"
          >
            <Download size={18} />
            {savingPdf ? "Saving PDF..." : "Save to PDF"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-[#0A024B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#081b3c] cursor-pointer"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {pdfError && (
        <div className="mx-auto mb-3 max-w-[820px] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 print:hidden">
          {pdfError}
        </div>
      )}

      {/* ── Preview content ── */}
      <div
        ref={printRef}
        className="mx-auto flex max-w-[820px] flex-col items-center gap-8 print:max-w-none print:gap-0"
      >
        <AdmissionPrintPreview data={data} />
      </div>
    </div>
  );
}
