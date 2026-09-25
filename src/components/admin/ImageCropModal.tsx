"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImageBlob } from "@/lib/cropImage";

type Props = {
  imageSrc: string;
  aspect: number;
  outputWidth: number;
  outputHeight: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

export function ImageCropModal({ imageSrc, aspect, outputWidth, outputHeight, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [procesando, setProcesando] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function confirmar() {
    if (!croppedAreaPixels) return;
    setProcesando(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, outputWidth, outputHeight);
      onConfirm(blob);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="disp" style={{ fontSize: "1.05rem", marginBottom: ".8rem" }}>
          Encuadrá la foto
        </h3>
        <p className="admin-hint" style={{ marginTop: 0, marginBottom: ".8rem" }}>
          Arrastrá para mover la foto y usá la barra para acercar o alejar. Lo que quede dentro del recuadro es
          exactamente lo que va a mostrarse en la web.
        </p>

        <div className="crop-modal-stage">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="crop-modal-zoom">
          <span className="admin-hint" style={{ margin: 0 }}>
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="crop-modal-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={procesando}>
            Cancelar
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={confirmar} disabled={procesando}>
            {procesando ? "Procesando..." : "Usar esta foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
