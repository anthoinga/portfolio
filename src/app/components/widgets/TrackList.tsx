import type { Track } from '@/app/types';

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="flex-1 bg-[rgba(0,0,0,0.4)] overflow-hidden mt-2 mb-2">
      <div className="flex">
        <div className="w-[424px] overflow-hidden">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center py-px w-full"
            >
              <div className="w-[39px] shrink-0 flex items-center justify-center">
                <span className="font-body text-[14px] text-[#adacb1] tracking-[1px]">
                  {track.id}
                </span>
              </div>
              <div className="flex-1 min-w-0 py-[6px]">
                <p className="font-body text-[14px] text-white truncate overflow-hidden">
                  {track.title}
                </p>
              </div>
              <div className="shrink-0 pl-2 pr-4 py-[6px]">
                <span className="font-body text-[14px] text-white opacity-60 tracking-[1px]">
                  {track.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
