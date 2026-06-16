import { cn } from '@xbrk/ui';

interface DynamicMeshProps {
  className?: string;
}

export default function DynamicMesh({ className }: DynamicMeshProps) {
  return (
    <div className={cn("fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none", className)}>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 mix-blend-screen blur-[120px] animate-mesh-1" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/15 mix-blend-screen blur-[120px] animate-mesh-2" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/15 mix-blend-screen blur-[120px] animate-mesh-3" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 mix-blend-screen blur-[120px] animate-mesh-1" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[50px] dark:bg-background/90" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}
