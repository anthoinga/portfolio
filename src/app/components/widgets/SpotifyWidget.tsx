import type { NowPlaying } from '@/app/types';
import { MusicPlayer } from './MusicPlayer';
import { TrackList } from './TrackList';
import { Spacer } from '@/app/components/layout/Spacer';
import { SPACING } from '@/app/data/constants';

interface SpotifyWidgetProps {
  nowPlaying: NowPlaying;
}

export function SpotifyWidget({ nowPlaying }: SpotifyWidgetProps) {
  return (
    <div
      className="spotifyWidget w-full shrink-0 overflow-clip rounded-[12px] flex flex-col"
      style={{ height: 'fit-content' }}
    >
      <div
        className="spotifyWidgetInner bg-[#e8e8e8] flex flex-col h-full min-w-[460px]"
        style={{
          paddingLeft: `${SPACING.tilePaddingX}px`,
          paddingRight: `${SPACING.tilePaddingX}px`,
          paddingTop: `${SPACING.tilePaddingY}px`,
        }}
      >
        <div className="spotifyWidgetHeader flex items-center justify-center pt-3 w-full">
          <p className="font-mono font-medium text-[16px] text-[#3d3d3d] uppercase text-center">
            Listening to
          </p>
        </div>

        <div
          className="spotifyWidgetPlayer flex flex-col overflow-clip rounded-[12px] mt-[23px] mb-[19px]"
          style={{
            height: 'fit-content',
            width: '424px',
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%),
              linear-gradient(90deg, ${nowPlaying.gradientColor} 0%, ${nowPlaying.gradientColor} 100%)
            `,
          }}
        >
          <MusicPlayer nowPlaying={nowPlaying} />
          <TrackList tracks={nowPlaying.tracks} />
        </div>

        <Spacer />
      </div>
    </div>
  );
}
