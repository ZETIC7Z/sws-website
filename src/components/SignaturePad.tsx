import { useRef, useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";

interface SignaturePadProps {
  onSave?: (base64: string) => void;
  onChange?: (base64: string) => void;
  onCancel?: () => void;
  width?: number;
  height?: number;
  showSaveButton?: boolean;
}

export default function SignaturePad({
  onSave,
  onChange,
  onCancel,
  width = 500,
  height = 140,
  showSaveButton = true,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawings, setHasDrawings] = useState(false);
  const syncPendingRef = useRef(false);

  // Set context styles on the target context
  const applyStyles = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 8.5; // thicker stroke for better high resolution scaling
    ctx.strokeStyle = "#ffffff"; // draw in white for contrast
  };

  // Helper to map mouse/touch pointers to backing store coordinates defensively
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const rectWidth = rect.width || canvas.clientWidth || width;
    const rectHeight = rect.height || canvas.clientHeight || height;
    
    // Calculate relative coordinates in CSS pixels
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Map to backing store dimensions defensively
    const x = rectWidth > 0 ? (relativeX * (canvas.width / rectWidth)) : relativeX;
    const y = rectHeight > 0 ? (relativeY * (canvas.height / rectHeight)) : relativeY;
    
    return { x, y };
  };

  const syncToParentRealtime = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onChange) return;
    
    // Since drawing context uses white stroke, the canvas already has white drawings on transparent background.
    // Exporting directly is fast and maintains alpha levels perfectly.
    onChange(canvas.toDataURL("image/png"));
  };

  const requestRealtimeSync = () => {
    if (!onChange || syncPendingRef.current) return;
    syncPendingRef.current = true;
    requestAnimationFrame(() => {
      syncToParentRealtime();
      syncPendingRef.current = false;
    });
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    applyStyles(ctx);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Draw a tiny dot immediately on pointerdown
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();

    setIsDrawing(true);
    setHasDrawings(true);
    requestRealtimeSync();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    applyStyles(ctx);

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawings(true);
    requestRealtimeSync();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    syncToParentRealtime();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawings(false);
    if (onChange) {
      onChange(""); // Clear in parent preview
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawings || !onSave) return;
    onSave(canvas.toDataURL("image/png"));
  };

  // Initialize canvas size (backing store size is fixed to width * 2, height * 2)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = width * 2;
    canvas.height = height * 2;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      applyStyles(ctx);
    }
  }, [width, height]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Canvas Box */}
      <div 
        className="relative border border-primary/30 rounded-xl overflow-hidden bg-black/45"
        style={{ height: `${height}px` }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!hasDrawings && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/45 text-xs tracking-wider uppercase font-heading select-none">
            Draw your signature here
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasDrawings}
          className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground hover:text-red-400 hover:border-red-500/20 disabled:opacity-40 disabled:hover:text-muted-foreground disabled:hover:border-border transition-all"
        >
          <Trash2 size={13} />
          Clear
        </button>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 border border-border rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
            >
              Cancel
            </button>
          )}

          {showSaveButton && onSave && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrawings}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 transition-all shadow-md shadow-primary/10"
            >
              <Check size={13} />
              Save Signature
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
