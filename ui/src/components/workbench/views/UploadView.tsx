import React, { useRef } from 'react';
import { UploadCloud, CheckCircle, RotateCcw, Zap, ExternalLink } from 'lucide-react';
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
    <section id="view-upload" className="view-section active space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center gap-3 flex-wrap pb-1">
        <h1 className="text-2xl font-bold font-display text-white tracking-wide">
          Image Upload
        </h1>
        <span className="badge font-mono text-[10.5px] tracking-[0.14em] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-md">
          T1 PAIRDESK
        </span>
        <div className="screen-subtitle w-full text-[12.5px] text-slate-400 font-mono tracking-wide mt-1">
          Upload the Reference and Source images and inspect their metadata before registration.
        </div>
      </div>

      {/* DROPZONES GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* REFERENCE / FIXED CARD */}
        <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13.5px] font-semibold font-display text-emerald-400 tracking-wide flex items-center gap-2.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(62,230,160,0.8)] inline-block" />
                • REFERENCE / FIXED
              </h3>
              <span className="badge font-mono text-[10px] tracking-[0.12em] text-slate-300 bg-slate-900/80 border border-slate-700/60 px-3 py-1 rounded-md">
                LRO NAC / WAC
              </span>
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
              className="dropzone min-h-60 rounded-xl border-2 border-dashed border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400/70 hover:bg-cyan-950/30 transition-all flex flex-col items-center justify-center cursor-pointer text-center p-6 group"
              onClick={() => refInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleRefDrop}
            >
              <div className="dz-icon mb-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-cyan-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="text-[14px] font-bold font-display text-white">
                {referenceImage ? referenceImage.name : 'Drop reference image here'}
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-2 tracking-[0.14em]">
                GEOTIFF / PDS • CLICK TO BROWSE
              </div>
              {referenceImage?.previewUrl && (
                <img
                  src={referenceImage.previewUrl}
                  alt="Reference preview"
                  className="mt-4 max-h-36 rounded-lg border border-[rgba(146,196,255,0.25)] object-contain shadow-lg"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="panel p-3 rounded-lg bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
              <div className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 tracking-[0.12em] uppercase">
                <span className="text-cyan-400">•</span> SENSOR
              </div>
              <div className="text-white mt-1.5 text-[12px] font-mono font-semibold">
                LRO NAC
              </div>
            </div>
            <div className="panel p-3 rounded-lg bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
              <div className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 tracking-[0.12em] uppercase">
                <span className="text-cyan-400">•</span> GSD
              </div>
              <div className="text-white mt-1.5 text-[12px] font-mono font-semibold">
                0.50 m/px
              </div>
            </div>
            <div className="panel p-3 rounded-lg bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
              <div className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 tracking-[0.12em] uppercase">
                <span className="text-cyan-400">•</span> SUN ANGLE
              </div>
              <div className="text-white mt-1.5 text-[12px] font-mono font-semibold">
                142.1° / 34.5°
              </div>
            </div>
          </div>
        </div>

        {/* SOURCE / MOVING CARD */}
        <div className="card p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13.5px] font-semibold font-display text-cyan-300 tracking-wide flex items-center gap-2.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(111,246,255,0.8)] inline-block" />
                • SOURCE / MOVING
              </h3>
              <span className="badge font-mono text-[10px] tracking-[0.12em] text-slate-300 bg-slate-900/80 border border-slate-700/60 px-3 py-1 rounded-md">
                OHRC / TMC-2 / IIRS
              </span>
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
              className="dropzone min-h-60 rounded-xl border-2 border-dashed border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400/70 hover:bg-cyan-950/30 transition-all flex flex-col items-center justify-center cursor-pointer text-center p-6 group"
              onClick={() => srcInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSrcDrop}
            >
              <div className="dz-icon mb-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-cyan-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="text-[14px] font-bold font-display text-white">
                {sourceImage ? sourceImage.name : 'Drop source image here'}
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-2 tracking-[0.14em]">
                GEOTIFF / PDS • CLICK TO BROWSE
              </div>
              {sourceImage?.previewUrl && (
                <img
                  src={sourceImage.previewUrl}
                  alt="Source preview"
                  className="mt-4 max-h-36 rounded-lg border border-[rgba(146,196,255,0.25)] object-contain shadow-lg"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="panel p-3 rounded-lg bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
              <div className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 tracking-[0.12em] uppercase">
                <span className="text-cyan-400">•</span> SENSOR
              </div>
              <select
                value={sourceSensor}
                onChange={(e) => setSourceSensor(e.target.value)}
                className="w-full mt-1 bg-transparent border-0 p-0 text-white text-[11.5px] font-mono font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Chandrayaan-2 OHRC" className="bg-slate-900 text-white">OHRC</option>
                <option value="Chandrayaan-2 TMC-2" className="bg-slate-900 text-white">TMC-2</option>
                <option value="Chandrayaan-2 IIRS" className="bg-slate-900 text-white">IIRS (Multi-spectral)</option>
              </select>
            </div>
            <div className="panel p-3 rounded-lg bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
              <div className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 tracking-[0.12em] uppercase">
                <span className="text-cyan-400">•</span> {sourceSensor.includes('IIRS') ? 'IIRS BAND' : 'GSD'}
              </div>
              <div className="text-white mt-1.5 text-[12px] font-mono font-semibold">
                {sourceSensor.includes('IIRS') ? (
                  <span className="text-cyan-300">Band #12</span>
                ) : (
                  sourceImage?.gsd || '0.25 m/px'
                )}
              </div>
            </div>
            <div className="panel p-3 rounded-lg bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
              <div className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 tracking-[0.12em] uppercase">
                <span className="text-cyan-400">•</span> SUN ANGLE
              </div>
              <div className="text-white mt-1.5 text-[12px] font-mono font-semibold">
                284.3° / 32.1°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAIR SUMMARY CARD */}
      <div className="card bracket p-6 sm:p-7 rounded-xl bg-slate-950/60 border border-[rgba(146,196,255,0.14)] backdrop-blur-md">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
          <div>
            <h3 className="text-[14px] font-bold font-display text-white tracking-wide uppercase">
              PAIR SUMMARY
            </h3>
            <p className="text-[12px] text-slate-400 font-mono tracking-wide mt-1">
              Metadata is evaluated by the automatic matcher gate prior to registration execution.
            </p>
          </div>
          <span
            className={`badge font-mono text-[10.5px] tracking-[0.14em] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-2 ${
              pairReady
                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                : 'text-slate-400 bg-slate-900/60 border border-slate-700/60'
            }`}
          >
            {pairReady ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                PAIR READY FOR REGISTRATION
              </>
            ) : (
              'WAITING FOR BOTH IMAGES'
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <div className="panel p-4 rounded-xl bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 tracking-[0.12em] uppercase">
              <span className="text-cyan-400">•</span> SCALE RATIO
            </div>
            <div className="text-white mt-2 font-mono text-[12.5px] font-semibold">
              320× max
            </div>
          </div>
          <div className="panel p-4 rounded-xl bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 tracking-[0.12em] uppercase">
              <span className="text-cyan-400">•</span> SUN-ANGLE DELTA
            </div>
            <div className="text-amber-400 mt-2 font-mono text-[12.5px] font-semibold">
              142.6°
            </div>
          </div>
          <div className="panel p-4 rounded-xl bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 tracking-[0.12em] uppercase">
              <span className="text-cyan-400">•</span> GSD STRATEGY
            </div>
            <div className="text-white mt-2 font-mono text-[12.5px] font-semibold">
              Common coarse
            </div>
          </div>
          <div className="panel p-4 rounded-xl bg-[#07111b]/80 border border-[rgba(146,196,255,0.12)]">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 tracking-[0.12em] uppercase">
              <span className="text-cyan-400">•</span> LABEL PARSER
            </div>
            <div className="text-white mt-2 font-mono text-[12.5px] font-semibold">
              PDS3 / PDS4 / JSON
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-7 pt-6 border-t border-[rgba(146,196,255,0.12)] flex-wrap">
          <button
            className="px-6 py-3 rounded-lg text-[12px] font-bold font-display tracking-[0.14em] bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer shadow-[0_0_18px_rgba(57,168,255,0.3)]"
            onClick={() => navigateTo('register')}
          >
            CONTINUE TO REGISTRATION <ExternalLink className="w-4 h-4" />
          </button>
          <button
            className="px-6 py-3 rounded-lg text-[12px] font-bold font-display tracking-[0.14em] border border-cyan-400/40 text-cyan-300 bg-cyan-950/30 hover:bg-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(111,246,255,0.15)]"
            onClick={loadSyntheticPair}
          >
            <Zap className="w-4 h-4 text-cyan-400" /> LOAD SYNTHETIC GENERATED PAIR
          </button>
          <button
            className="px-6 py-3 rounded-lg text-[12px] font-bold font-display tracking-[0.14em] border border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-600 flex items-center gap-2 transition-all cursor-pointer"
            onClick={clearUploads}
          >
            <RotateCcw className="w-4 h-4" /> CLEAR UPLOADS
          </button>
        </div>
      </div>
    </section>
  );
};

