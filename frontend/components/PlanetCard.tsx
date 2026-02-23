import { motion } from "framer-motion";

interface PlanetData {
  pl_name: string;
  pl_rade: number;
  pl_bmasse: number;
  st_teff: number;
  sy_dist: number;
  habitability_score: number;
  planet_type: string; // Field baru dari hasil klasifikasi backend
}

export default function PlanetCard({ planet, index }: { planet: PlanetData; index: number }) {
  const scorePercentage = (planet.habitability_score * 100).toFixed(1);
  
  // Mapping tipe planet ke aset visual di folder /public/planets/
  const planetImage = `/planets/${planet.planet_type || 'rocky'}.svg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative p-4 md:p-6 rounded-lg md:rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-all group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Visualisasi Planet AI dengan Animasi Rotasi */}
      <div className="relative h-24 md:h-32 w-full mb-4 md:mb-6 flex items-center justify-center overflow-hidden rounded-lg md:rounded-xl bg-zinc-900/30 border border-white/5 shadow-inner">
        <motion.img
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          src={planetImage}
          alt={planet.planet_type}
          className="h-16 md:h-24 w-16 md:w-24 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:drop-shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all"
        />
        <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 px-2 py-0.5 rounded bg-black/60 border border-white/10">
          <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-tighter text-zinc-500">
            {planet.planet_type}
          </span>
        </div>
      </div>

      <h3 className="text-lg md:text-xl font-bold text-emerald-400 font-mono mb-3 md:mb-4 tracking-tight truncate">
        <span className="text-emerald-600 mr-1">#</span>{planet.pl_name}
      </h3>
      
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-zinc-400 font-mono">
        <p className="flex justify-between gap-2">
          <span className="truncate">R:</span> <span className="text-zinc-200 truncate">{planet.pl_rade.toFixed(2)}</span>
        </p>
        <p className="flex justify-between gap-2">
          <span className="truncate">M:</span> <span className="text-zinc-200 truncate">{planet.pl_bmasse.toFixed(2)}</span>
        </p>
        <p className="flex justify-between gap-2">
          <span className="truncate">T★:</span> <span className="text-zinc-200 truncate">{Math.round(planet.st_teff)}K</span>
        </p>
        <p className="flex justify-between gap-2">
          <span className="truncate">d:</span> <span className="text-zinc-200 truncate">{Math.round(planet.sy_dist)}pc</span>
        </p>
      </div>

      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-zinc-800/80">
        <div className="flex justify-between items-end gap-3">
          <div>
            <p className="text-[8px] md:text-[10px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">
              Habitability
            </p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
              {scorePercentage}%
            </p>
          </div>
          <div className="h-2 w-12 md:w-16 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 flex-shrink-0">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${scorePercentage}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}