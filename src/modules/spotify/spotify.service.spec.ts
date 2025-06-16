import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import {
  Playlist,
  SpotifySearchResponse,
} from '../../types/spotify/spotify-search';

describe('SpotifyService', () => {
  let service: SpotifyService;

  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
    jest.clearAllMocks();

    process.env.SPOTIFY_CLIENT_ID = 'test-client-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'test-client-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should throw error if token fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
      });

      await expect(service.getAccessToken()).rejects.toThrow(
        'Failed to fetch Spotify access token',
      );
    });
  });

  describe('getPlaylistByBeerStyle', () => {
    it('should return a playlist for a given beer style', async () => {
      const mockPlaylist: Playlist = {
        id: 'playlist1',
        name: 'IPA Playlist',
        tracks: { href: 'tracks-url', total: 10 },
        collaborative: false,
        description: '',
        external_urls: { spotify: '' },
        href: '',
        images: [],
        owner: {
          display_name: 'Test Owner',
          external_urls: { spotify: '' },
          href: '',
          id: 'owner-id',
          type: 'user',
          uri: 'spotify:user:owner-id',
        },
        public: false,
        snapshot_id: '',
        type: '',
        uri: '',
      };
      const mockResponse: Partial<SpotifySearchResponse> = {
        playlists: {
          items: [mockPlaylist],
          href: '',
          limit: 0,
          next: '',
          offset: 0,
          previous: '',
          total: 0,
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({
            access_token: 'test-token',
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue(mockResponse),
        });

      const result = await service.getPlaylistByBeerStyle('IPA');
      expect(result).toEqual(mockPlaylist);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/search?q=IPA&type=playlist&limit=1',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }),
      );
    });

    it('should return null if no playlists found', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({
            access_token: 'test-token',
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({}),
        });

      const result = await service.getPlaylistByBeerStyle('IPA');
      expect(result).toBeNull();
    });
  });

  describe('getPlaylistTracks', () => {
    it('should return empty array if no tracks found', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({
            access_token: 'test-token',
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({ items: [] }),
        });

      const result = await service.getPlaylistTracks('playlist1');
      expect(result).toEqual([]);
    });
  });
});
