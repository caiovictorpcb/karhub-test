import { Injectable } from '@nestjs/common';
import {
  Playlist,
  SpotifySearchResponse,
} from '../../types/spotify/spotify-search';
import {
  SpotifyTracksResponse,
  Track,
} from '../../types/spotify/spotify-tracks';
import { SpotifyTokenResponse } from '../../types/spotify/spotify-token';

@Injectable()
export class SpotifyService {
  private token: string;
  private tokenExpiresAt: number;

  async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.token && now < this.tokenExpiresAt) return this.token;

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = (await res.json()) as SpotifyTokenResponse;
    if (!data || !data.access_token || !data.expires_in) {
      throw new Error('Failed to fetch Spotify access token');
    }
    this.token = data.access_token;
    this.tokenExpiresAt = now + data.expires_in * 1000;

    return this.token;
  }

  async getPlaylistByBeerStyle(beerStyle: string): Promise<Playlist | null> {
    const token = await this.getAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(beerStyle)}&type=playlist&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = (await res.json()) as SpotifySearchResponse;
    if (!data || !data.playlists || !data.playlists.items) {
      console.error('No playlists found for beer style:', beerStyle);
      return null;
    }
    return data?.playlists?.items?.[0];
  }

  async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const token = await this.getAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = (await res.json()) as SpotifyTracksResponse;
    return (
      data.items?.filter((item) => item.track).map((item) => item.track) ?? []
    );
  }
}
