export type TileSize = 'large' | 'small';

export interface ProjectMetadata {
  frameworks?: string[];
  tools?: string[];
  platform?: string[];
  skills?: string[];
  projectType?: string;
  year?: string;
}

export interface Project {
  id: string;
  size: TileSize;
  imageUrl: string;
  imageAlt: string;
  url: string;
  header?: string;
  category?: string;
  title?: string;
  location?: string;
  date?: string;
  metadata?: ProjectMetadata;
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
  title?: string;
  location: string;
}

export interface FooterInfo {
  name: string;
  copyright: string;
  tagline: string;
}

export interface FilterQuery {
  raw: string;
  frameworks?: string[];
  platforms?: string[];
  skills?: string[];
  tools?: string[];
  projectType?: string;
  year?: string;
}

export interface ParsedFilter {
  query: FilterQuery;
  matchedProjects: string[];
  totalMatches: number;
}

export interface FilterResult extends ParsedFilter {
  response: string;
  voiceProfile: VoiceProfile;
}

export interface ResponsePattern {
  triggers: string[];
  templates: string[];
}

export interface VoiceProfile {
  personality: string[];
  tone: string[];
  responsePatterns: {
    greeting: string[];
    results: string[];
    noResults: string[];
    clarification: string[];
  };
  intentPatterns?: {
    process?: ResponsePattern;
    problemFraming?: ResponsePattern;
    constraints?: ResponsePattern;
    collaboration?: ResponsePattern;
    failures?: ResponsePattern;
    techStack?: ResponsePattern;
    context?: {
      enterprise?: ResponsePattern;
      consumer?: ResponsePattern;
      startup?: ResponsePattern;
      scale?: ResponsePattern;
    };
  };
}
