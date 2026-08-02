import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function FrameScrollAnimation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [metadata, setMetadata] = useState(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 1. Carregar metadados
  useEffect(() => {
    fetch('/frames/metadata.json')
      .then((res) => res.json())
      .then((data) => {
        setMetadata(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar metadados dos frames:', err);
      });
  }, []);

  // 2. Pré-carregar todas as imagens dos frames
  useEffect(() => {
    if (!metadata || !metadata.totalFrames) return;

    let loadedCount = 0;
    const total = metadata.totalFrames;
    const loadedImages = new Array(total);

    for (let i = 1; i <= total; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0');
      img.src = `/frames/frame${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / total) * 100));
        if (loadedCount === total) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        img.src = `/frames/frame${frameNum}.png`;
      };
      loadedImages[i - 1] = img;
    }
  }, [metadata]);

  // 3. Renderizar no Canvas com suporte a Scroll travado no container
  useEffect(() => {
    if (!imagesLoaded || !metadata) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let currentFrameIndex = 0;
    let targetFrameIndex = 0;
    let animationFrameId = null;

    const renderFrame = (index) => {
      const idx = Math.max(0, Math.min(metadata.totalFrames - 1, Math.round(index)));
      const img = imagesRef.current[idx];
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    canvas.width = metadata.width || 1280;
    canvas.height = metadata.height || 720;
    renderFrame(0);

    const updateAnimation = () => {
      const diff = targetFrameIndex - currentFrameIndex;
      if (Math.abs(diff) > 0.01) {
        currentFrameIndex += diff * 0.15;
        renderFrame(currentFrameIndex);
      } else {
        currentFrameIndex = targetFrameIndex;
        renderFrame(currentFrameIndex);
      }
      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    animationFrameId = requestAnimationFrame(updateAnimation);

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = container.offsetHeight - windowHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      
      targetFrameIndex = progress * (metadata.totalFrames - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [imagesLoaded, metadata]);

  return (
    <div ref={containerRef} className="relative h-[140vh] w-full bg-[#0a0a0f]">
      {/* Container sticky centralizado com ambient glow ao fundo */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8">
        
        {/* Glow ambient de fundo para efeito 3D / Apple */}
        <div className="absolute w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Container Principal Imersivo (Sem Moldura Fictícia de Navegador) */}
        <div className="relative w-full max-w-[96vw] xl:max-w-7xl h-[82vh] max-h-[860px] rounded-2xl sm:rounded-3xl border border-[#1e1e2e] bg-[#0d0d14]/90 backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.18)] hover:border-blue-500/30 transition-all duration-500 group">
          
          {/* Sombra interna superior e reflexo sutil */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 pointer-events-none z-10" />

          {/* Badges Flutuantes estilo Apple / SaaS Moderno */}
          <div className="absolute top-4 left-5 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0a0f]/80 border border-[#1e1e2e] backdrop-blur-xl shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-white tracking-wide">Rastreamento Ativo</span>
          </div>

          <div className="absolute top-4 right-5 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0a0f]/80 border border-[#1e1e2e] backdrop-blur-xl shadow-xl">
            <span className="text-[11px] font-medium text-[#8888a0]">Aceite Digital • SHA-256</span>
          </div>

          {/* Canvas de Renderização da Sequência 100% Imersivo */}
          <div className="relative w-full h-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
            {!imagesLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] z-20 gap-3">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[#8888a0] font-medium tracking-wide">
                  Carregando experiência imersiva ({loadingProgress}%)
                </span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block group-hover:scale-[1.005] transition-transform duration-700"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

