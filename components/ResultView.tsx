
import React, { useState, useRef } from 'react';
import { PersonaAnalysis, ResearchScores } from '../types';
import DimensionsChart from './DimensionsChart';
import { generateMangaCard } from '../services/geminiService';

interface Props {
  analysis: PersonaAnalysis;
  scores: ResearchScores;
  onReset: () => void;
}

const ResultView: React.FC<Props> = ({ analysis, scores, onReset }) => {
  const [mangaImageUrl, setMangaImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const url = await generateMangaCard(base64, analysis.archetype, analysis.title);
        setMangaImageUrl(url);
      } catch (err) {
        alert("名片生成失败，请重试。");
      } finally {
        setIsGenerating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadPortrait = () => {
    if (!mangaImageUrl) return;
    const link = document.createElement('a');
    link.href = mangaImageUrl;
    link.download = `Research_Persona_Portrait_${analysis.archetype}.png`;
    link.click();
  };

  const downloadFullCard = () => {
    if (!mangaImageUrl) return;
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // 800px width based on scaling the 320px preview by 2.5x
      const scale = 2.5;
      const cardWidth = 320 * scale;
      const cardHeight = 480 * scale; // Adjusting height to match aspect ratio
      const padding = 16 * scale;

      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Card border
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(0, 0, cardWidth, cardHeight);

      // 1. Top Section
      // Archetype (text-[10px] -> 25px)
      ctx.fillStyle = '#000000';
      ctx.font = `900 ${10 * scale}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const archetypeText = analysis.archetype.toUpperCase();
      // Letter spacing simulation
      const spacing = 0.2 * 10 * scale;
      let x = padding;
      for (let i = 0; i < archetypeText.length; i++) {
        ctx.fillText(archetypeText[i], x, padding);
        x += ctx.measureText(archetypeText[i]).width + spacing;
      }

      // Title (text-[11px] -> 27.5px)
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.font = `italic ${11 * scale}px Noto Serif SC, serif`;
      ctx.fillText(analysis.title, padding, padding + (16 * scale));

      // ID Badge
      const badgeRadius = 12 * scale;
      const badgeX = cardWidth - padding - badgeRadius;
      const badgeY = padding + badgeRadius;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${8 * scale}px JetBrains Mono, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ID', badgeX, badgeY);

      // 2. Middle Section (Image)
      const imgPadding = 4 * scale;
      const imgSize = cardWidth - (padding * 2);
      const imgY = padding + (48 * scale);
      
      // Grayscale and Clip image
      ctx.save();
      ctx.beginPath();
      const radius = 12 * scale;
      ctx.roundRect(padding, imgY, imgSize, imgSize, radius);
      ctx.clip();
      ctx.drawImage(img, padding, imgY, imgSize, imgSize);
      ctx.restore();

      // 3. Bottom Section
      const bottomY = imgY + imgSize + (16 * scale);
      ctx.beginPath();
      ctx.moveTo(padding, bottomY);
      ctx.lineTo(cardWidth - padding, bottomY);
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.font = `700 ${8 * scale}px Inter, sans-serif`;
      ctx.fillText('AUTH LEVEL: ALPHA', padding, bottomY + (16 * scale));
      
      const serial = Math.random().toString(36).substr(2, 6).toUpperCase();
      ctx.fillText(`REF: ${serial}`, padding, bottomY + (28 * scale));

      // QR Placeholder
      ctx.globalAlpha = 0.2;
      ctx.fillRect(cardWidth - padding - (40 * scale), bottomY + (16 * scale), 40 * scale, 40 * scale);
      ctx.globalAlpha = 1.0;

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Research_ID_Card_${analysis.archetype}.png`;
      link.click();
    };
    img.crossOrigin = "anonymous";
    img.src = mangaImageUrl;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
      {/* 1. Identity Card Section (MOVED TO TOP) */}
      <div className="bg-white border border-black rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-black/5">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-black tracking-[0.3em] uppercase rounded">
              Identity Protocol
            </div>
            <h3 className="text-4xl font-black serif-font tracking-tight">生成你的研究 ID Card</h3>
            <p className="text-black/60 text-base leading-relaxed">
              上传照片，AI 将为你生成一张融合研究人格特征的专属 ID 名片。包含你的风格定位、核心语录及艺术化形象。
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="px-8 py-4 bg-black text-white rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all disabled:opacity-30 shadow-xl"
              >
                {isGenerating ? 'GEN-SEQUENCE...' : 'Upload Portrait'}
              </button>
              {mangaImageUrl && !isGenerating && (
                <>
                  <button
                    onClick={downloadFullCard}
                    className="px-6 py-4 border-2 border-black rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all"
                  >
                    下载名片
                  </button>
                  <button
                    onClick={downloadPortrait}
                    className="px-6 py-4 text-black/40 font-black uppercase tracking-widest text-[10px] hover:text-black transition-all"
                  >
                    下载画像
                  </button>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            {/* The ID Card Preview */}
            <div className="w-full max-w-[320px] aspect-[3/4.5] bg-white border border-black/10 rounded-2xl p-4 shadow-2xl flex flex-col relative overflow-hidden group">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 scanning relative w-full h-full justify-center">
                  <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black tracking-[0.5em] opacity-30 uppercase mono-font">Encoding Persona</span>
                </div>
              ) : mangaImageUrl ? (
                <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">{analysis.archetype}</p>
                      <p className="font-serif italic text-[11px] leading-tight text-black/50">{analysis.title}</p>
                    </div>
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <span className="text-[8px] text-white mono-font">ID</span>
                    </div>
                  </div>
                  <div className="flex-grow overflow-hidden rounded-xl border border-black/5">
                    <img src={mangaImageUrl} alt="Persona" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-black/30 uppercase tracking-widest">Auth Level: ALPHA</p>
                      <p className="text-[8px] font-bold text-black/30 uppercase tracking-widest mono-font">REF: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 flex items-center justify-center opacity-20">
                      <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v3h-2v-3zm3 3h2v2h-2v-2zm-3 2h3v2h-3v-2zm3 3h5v2h-5v-2zm-3-3h2v3h-2v-3zm6-6h2v3h-2v-3zm-3 0h2v3h-2v-3z"/></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-10 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 border-2 border-dashed border-black rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black">+</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest mono-font">Identity Required</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed Report Section */}
      <div className="bg-white border border-black rounded-[2rem] overflow-hidden shadow-sm">
        <div className="bg-black p-10 md:p-16 text-white relative">
          <div className="tech-grid absolute inset-0 opacity-10"></div>
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mono-font">Epistemological Analysis</span>
            <h2 className="text-4xl md:text-6xl font-black serif-font tracking-tighter">{analysis.archetype}</h2>
            <p className="text-lg opacity-60 font-serif italic">“{analysis.title}”</p>
          </div>
        </div>

        <div className="p-10 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/30 mono-font">Style Report</h3>
              <p className="text-lg text-black leading-snug font-medium">
                {analysis.description}
              </p>
            </section>

            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-black/5">
              <DimensionsChart scores={scores} />
            </div>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-6">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mono-font">Edge Case</h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-[13px] font-bold flex gap-2">
                      <span className="text-black">□</span> {s}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mono-font">Limitation</h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-[13px] text-black/50 flex gap-2">
                      <span>▪</span> {w}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="border-t border-black/5 pt-10">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/30 mono-font mb-4">Tactical Advice</h3>
              <p className="text-sm text-black/70 leading-relaxed italic">
                {analysis.tasteAdvice}
              </p>
            </section>

            <div className="pt-6 flex flex-wrap gap-2">
              {analysis.matchedResearchers.map((name, i) => (
                <span key={i} className="px-3 py-1 border border-black/5 bg-slate-50 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset} 
          className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30 hover:text-black transition-colors py-4 border-b border-transparent hover:border-black/20"
        >
          Reset_Sequence
        </button>
      </div>

      {/* Hidden canvas for card generation */}
      <canvas ref={cardCanvasRef} className="hidden" />
    </div>
  );
};

export default ResultView;
