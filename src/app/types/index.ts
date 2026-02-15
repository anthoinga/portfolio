export type TileSize = 'large' | 'small';

export interface Project {
  id: string;
  size: TileSize;
  imageUrl: string;
  imageAlt: string;
  url: string;
  header?: string;
  category?: string;
}

export interface Track {
  id: number;
  title: string;
  duration: string;
}

export interface NowPlaying {
  albumName: string;
  artistName: string;
  albumArt: string;
  currentTime: string;
  remainingTime: string;
  tracks: Track[];
  gradientColor: string;
}

export interface HeaderInfo {
  name: string;
  title: string;
  location: string;
}

export interface FooterInfo {
  name: string;
  copyright: string;
  tagline: string;
}
