import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = '6c92e95a8e72467a90def3c3e979fa18';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || '';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken() {
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  return response.json();
}

async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (response.status === 204) {
    // Nothing is currently playing, get recently played
    const recentResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (recentResponse.status === 200) {
      const data = await recentResponse.json();
      return { ...data.items[0], is_playing: false };
    }

    return null;
  }

  if (response.status === 200) {
    return response.json();
  }

  return null;
}

export async function GET() {
  try {
    const data = await getNowPlaying();

    if (!data) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const track = data.track || data.item;

    if (!track) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    return NextResponse.json({
      isPlaying: data.is_playing,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      albumImageUrl: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
      duration: track.duration_ms,
      progress: data.progress_ms || 0,
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json({ isPlaying: false, error: 'Failed to fetch' }, { status: 500 });
  }
}
