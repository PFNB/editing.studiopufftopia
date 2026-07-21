import { PortfolioItem } from '../types';
import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioGridProps {
  items: PortfolioItem[];
  type: 'long' | 'short';
}

function getEmbedUrl(url: string) {
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtube.com/shorts/')) {
    return url.replace('shorts/', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/');
  }
  if (url.includes('instagram.com/')) {
    const cleanUrl = url.split('?')[0];
    return cleanUrl.endsWith('/') ? `${cleanUrl}embed/` : `${cleanUrl}/embed/`;
  }
  return url;
}

export function PortfolioGrid({ items, type }: PortfolioGridProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [metadata, setMetadata] = useState<Record<string, {title: string, duration: string, thumbnail: string, loading: boolean}>>({});
  const isShortForm = type === 'short';

  useEffect(() => {
    items.forEach(async (item) => {
      if (item.videoUrl && !metadata[item.id]?.thumbnail && !metadata[item.id]?.loading) {
        setMetadata(prev => ({ 
          ...prev, 
          [item.id]: {
            ...prev[item.id],
            loading: true
          }
        }));
        try {
          const res = await fetch(`/api/metadata?url=${encodeURIComponent(item.videoUrl)}`);
          if (res.ok) {
            const data = await res.json();
            setMetadata(prev => ({ 
              ...prev, 
              [item.id]: {
                title: data.title || item.title || '',
                duration: data.duration || item.duration || '',
                thumbnail: data.thumbnail || item.thumbnailUrl || '',
                loading: false
              }
            }));
          }
        } catch (e) {
          console.error("Failed to fetch metadata for", item.videoUrl);
          setMetadata(prev => ({ 
            ...prev, 
            [item.id]: {
              ...prev[item.id],
              loading: false
            }
          }));
        }
      }
    });
  }, [items]);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };
  
  return (
    <>
      <div className="relative group">
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-zinc-900 border border-zinc-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => {
            const className = `flex-none snap-start group cursor-pointer relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 block text-left ${
              isShortForm ? 'w-[calc(50%-12px)] md:w-[calc(25%-18px)]' : 'w-full md:w-[calc(50%-12px)]'
            }`;
            const style = { aspectRatio: isShortForm ? '9/16' : '16/9' };

            const isLoading = metadata[item.id]?.loading;
            const displayTitle = metadata[item.id]?.title || item.title || 'Video';
            const displayDuration = metadata[item.id]?.duration || item.duration || '';
            const displayThumbnail = metadata[item.id]?.thumbnail || item.thumbnailUrl || '';

            const InnerContent = isLoading ? (
              <div className="w-full h-full bg-zinc-800 animate-pulse flex flex-col justify-end p-4">
                {!isShortForm && <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>}
                <div className="h-3 bg-zinc-700 rounded w-1/4"></div>
              </div>
            ) : (
              <>
                {displayThumbnail && (
                  <img 
                    src={displayThumbnail} 
                    alt={displayTitle}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300"
                  />
                )}
                {item.videoUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#FFE600] rounded-full flex items-center justify-center pl-1 shadow-lg shadow-[#FFE600]/20 hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent"></div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  {!isShortForm && <h4 className="font-bold text-white text-sm md:text-base line-clamp-1">{displayTitle}</h4>}
                  {displayDuration && <span className="text-xs font-bold text-zinc-400 mt-1 block">{displayDuration}</span>}
                </div>
              </>
            );

            if (item.videoUrl) {
              return (
                <button 
                  key={item.id} 
                  className={className} 
                  style={style}
                  onClick={() => setActiveVideo(item.videoUrl || null)}
                >
                  {InnerContent}
                </button>
              );
            }

            return (
              <div key={item.id} className={className} style={style}>
                {InnerContent}
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-zinc-900 border border-zinc-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <div className={`relative w-full ${isShortForm ? 'max-w-[400px] aspect-[9/16]' : 'max-w-5xl aspect-video'} bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center`} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full relative flex items-center justify-center">
              <iframe 
                src={`${getEmbedUrl(activeVideo)}?autoplay=1`}
                width="100%" 
                height="100%" 
                className="absolute top-0 left-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
