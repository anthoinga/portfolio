import Image from 'next/image';
import type { Project } from '@/app/types';
import { TILE_SIZES, SPACING } from '@/app/data/constants';
import { Spacer } from '@/app/components/layout/Spacer';

export function ProjectTile({
  size,
  imageUrl,
  imageAlt,
  url,
  header,
}: Project) {
  const dimensions = TILE_SIZES[size];

  return (
    <a
      href={url}
      className="projectTile flex flex-col overflow-clip rounded-[12px] w-full shrink-0 hover:opacity-90 transition-opacity"
      style={{
        height: `${dimensions.height}px`,
        minHeight: `${dimensions.minHeight}px`,
      }}
    >
      <div
        className="projectTileContent bg-[#e8e8e8] flex flex-col items-center justify-between h-full w-full"
        style={{
          paddingLeft: `${SPACING.tilePaddingX}px`,
          paddingRight: `${SPACING.tilePaddingX}px`,
          paddingTop: `${SPACING.tilePaddingY}px`,
          paddingBottom: `${SPACING.tilePaddingY}px`,
        }}
      >
        {header ? (
          <div className="projectTileHeader flex items-center justify-center pt-3 w-full">
            <p className="font-mono font-medium text-[16px] text-[#3d3d3d] uppercase text-center">
              {header}
            </p>
          </div>
        ) : (
          <Spacer />
        )}

        <div className="projectTileImageArea flex-1 relative w-full flex items-center justify-center min-h-0">
          <div
            className="projectTileImageWrapper relative w-full h-full"
            style={{ boxShadow: 'none' }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>

        <Spacer />
      </div>
    </a>
  );
}
