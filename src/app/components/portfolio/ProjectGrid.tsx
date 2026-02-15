import { ProjectColumn } from './ProjectColumn';
import { SpotifyWidget } from '@/app/components/widgets/SpotifyWidget';
import {
  column1Projects,
  column2Projects,
  column3Projects,
} from '@/app/data/projects';
import { nowPlaying } from '@/app/data/music';
import { SPACING } from '@/app/data/constants';

export function ProjectGrid() {
  return (
    <div
      className="grid flex flex-col md:flex-row md:flex-wrap items-start w-full"
      style={{ gap: `${SPACING.tileGap}px` }}
    >
      <ProjectColumn projects={column1Projects} />
      <ProjectColumn projects={column2Projects} />
      <ProjectColumn projects={column3Projects}>
        <SpotifyWidget nowPlaying={nowPlaying} />
      </ProjectColumn>
    </div>
  );
}
