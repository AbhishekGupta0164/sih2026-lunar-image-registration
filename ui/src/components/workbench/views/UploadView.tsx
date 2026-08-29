import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const UploadView: React.FC = () => {
  const {
    referenceImage,
    sourceImage,
    sourceSensor,
    setReferenceFile,
    setSourceFile,
    setSourceSensor,
    clearUploads,
    loadSyntheticPair,
    navigateTo,
  } = useApp();

  const refInputRef = useRef<HTMLInputElement | null>(null);
  const srcInputRef = useRef<HTMLInputElement | null>(null);

  const handleRefDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReferenceFile(e.dataTransfer.files[0]);
    }
  };

  const handleSrcDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSourceFile(e.dataTransfer.files[0]);
    }
  };

  const pairReady = referenceImage !== null && sourceImage !== null;

  return (
    <section id="view-upload" className="view-section active">
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="screen-title">Image Upload</div>
        <span className="badge text-brand-400">T1 PAIRDESK</span>
        <div className="screen-subtitle w-full">
          Upload the Reference and Source images and inspect their metadata before registration.
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* REFERENCE / FIXED */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-success tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(62,230,160,0.8)]" />
              REFERENCE / FIXED
            </h3>
            <span className="badge">LRO NAC / WAC</span>
          </div>
          <input
            ref={refInputRef}
            type="file"
            accept="image/*,.tif,.tiff,.lbl,.xml,.json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setReferenceFile(e.target.files[0]);
              }
            }}
          />
          <div
            className="dropzone min-h-56 flex flex-col items-center justify-center cursor-pointer text-center px-4"
            onClick={() => refInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleRefDrop}
          >
            <div className="dz-icon mb-3.5">
              <UploadCloud className="w-5 h-5 text-brand-400" />
            </div>
            <div className="text-[13px] text-slate-200">
              {referenceImage ? referenceImage.name : 'Drop reference image here'}
            </div>
            <div className="font-mono text-[9px] text-slate-500 mt-1.5 tracking-[0.14em]">
              GEOTIFF / PDS • CLICK TO BROWSE
            </div>
            {referenceImage?.previewUrl && (
              <img
                src={referenceImage.previewUrl}
                alt="Reference preview"
                className="mt-3 max-h-32 rounded-lg border border-[rgba(146,196,255,0.2)] object-contain"
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="panel p-2.5">
              <div className="mini-label">Sensor</div>
              <div className="text-slate-200 mt-1.5 text-[11px] font-mono">
                LRO NAC
              </div>
            </div>
            <div className="panel p-2.5">
              <div className="mini-label">GSD</div>
              <div className="text-slate-200 mt-1.5 text-[11px] font-mono">
                0.50 m/px
              </div>
            </div>
            <div className="panel p-2.5">
              <div className="mini-label">Sun</div>
              <div className="text-slate-200 mt-1.5 text-[11px] font-mono">
                142.1° / 34.5°
              </div>
            </div>
          </div>
        </div>

        {/* SOURCE / MOVING */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-brand-300 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(111,246,255,0.8)]" />
              SOURCE / MOVING
            </h3>
            <span className="badge">OHRC / TMC-2 / IIRS</span>
          </div>
          <input
            ref={srcInputRef}
            type="file"
            accept="image/*,.tif,.tiff,.lbl,.xml,.json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSourceFile(e.target.files[0]);
              }
            }}
          />
          <div
            className="dropzone min-h-56 flex flex-col items-center justify-center cursor-pointer text-center px-4"
            onClick={() => srcInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleSrcDrop}
          >
            <div className="dz-icon mb-3.5">
              <UploadCloud className="w-5 h-5 text-brand-400" />
            </div>
            <div className="text-[13px] text-slate-200">
              {sourceImage ? sourceImage.name : 'Drop source image here'}
            </div>
            <div className="font-mono text-[9px] text-slate-500 mt-1.5 tracking-[0.14em]">
              GEOTIFF / PDS • CLICK TO BROWSE
            </div>
            {sourceImage?.previewUrl && (
              <img
                src={sourceImage.previewUrl}
                alt="Source preview"
                className="mt-3 max-h-32 rounded-lg border border-[rgba(146,196,255,0.2)] object-contain"
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="panel p-2.5">
              <div className="mini-label">Sensor</div>
              <select
                value={sourceSensor}
                onChange={(e) => setSourceSensor(e.target.value)}
                className="w-full mt-1.5 bg-transparent border-0 p-0 text-slate-200 text-[11px] font-mono"
              >
                <option value="Chandrayaan-2 OHRC">Chandrayaan-2 OHRC</option>
                <option value="Chandrayaan-2 TMC-2">Chandrayaan-2 TMC-2</option>
                <option value="Chandrayaan-2 IIRS">Chandrayaan-2 IIRS</option>
              </select>
            </div>
            <div className="panel p-2.5">
              <div className="mini-label">GSD</div>
              <div className="text-slate-200 mt-1.5 text-[11px] font-mono">
                {sourceImage?.gsd || '0.25 m/px'}
              </div>
            </div>
            <div className="panel p-2.5">
              <div className="mini-label">Sun</div>
              <div className="text-slate-200 mt-1.5 text-[11px] font-mono">
                284.3° / 32.1°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAIR SUMMARY */}
      <div className="card bracket p-5 mt-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-[13px] font-semibold text-white tracking-wide">
              PAIR SUMMARY
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Metadata is used by the automatic matcher gate.
            </p>
          </div>
          <span
            className={`badge ${
              pairReady
                ? 'text-success border-[rgba(62,230,160,0.4)]'
                : 'text-slate-400'
            }`}
          >
            {pairReady
              ? 'PAIR READY FOR REGISTRATION'
              : 'WAITING FOR BOTH IMAGES'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="panel p-3">
            <div className="mini-label">Scale ratio</div>
            <div className="text-white mt-1.5 font-mono text-[11px]">
              320× max
            </div>
          </div>
          <div className="panel p-3">
            <div className="mini-label">Sun-angle</div>
            <div className="text-warning mt-1.5 font-mono text-[11px]">
              142.6°
            </div>
          </div>
          <div className="panel p-3">
            <div className="mini-label">GSD strategy</div>
            <div className="text-white mt-1.5 font-mono text-[11px]">
              Common coarse
            </div>
          </div>
          <div className="panel p-3">
            <div className="mini-label">Label parser</div>
            <div className="text-white mt-1.5 font-mono text-[11px]">
              PDS3 / PDS4 / JSON
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 mt-4 flex-wrap">
          <button
            className="btn-primary px-5 py-2.5 rounded-lg text-[11px] tracking-wider"
            onClick={() => navigateTo('register')}
          >
            CONTINUE TO REGISTRATION ↗
          </button>
          <button
            className="btn-secondary px-5 py-2.5 rounded-lg text-[11px] tracking-wider border-brand-400/40 text-brand-300 hover:bg-brand-500/10"
            onClick={loadSyntheticPair}
          >
            ⚡ LOAD SYNTHETIC GENERATED PAIR
          </button>
          <button
            className="btn-secondary px-5 py-2.5 rounded-lg text-[11px] tracking-wider"
            onClick={clearUploads}
          >
            CLEAR
          </button>
        </div>
      </div>
    </section>
  );
};
