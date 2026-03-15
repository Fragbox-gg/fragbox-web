// lib/faceit/types.ts
export interface Player {
  player_id: string;
  nickname: string;
  avatar: string;
  skill_level: number;
  game_player_id: string;
  game_player_name: string;
  faceit_url: string;
}

export interface Team {
  team_id: string;
  nickname: string;
  avatar: string;
  type: string;
  players: Player[];
}

export interface HistoryMatch {
  match_id: string;
  game_id: string;
  region: string;
  match_type: string;
  game_mode: string;
  max_players: number;
  teams_size: number;
  teams: {
    faction1: Team;
    faction2: Team;
  };
  playing_players: string[];
  competition_id: string;
  competition_name: string;
  competition_type: string;
  organizer_id: string;
  status: string;
  started_at: number;
  finished_at: number;
  results: {
    winner: 'faction1' | 'faction2';
    score: {
      faction1: number;
      faction2: number;
    };
  };
  faceit_url: string;
}

export interface MatchDetails {
  match_id: string;
  status: string;
  teams: {
    faction1: Team;
    faction2: Team;
  };
  voting?: {
    map: {
      pick: string[];
      entities: Array<{
        name: string;
        class_name: string;
        image_lg: string;
        image_sm: string;
      }>;
    };
  };
  results?: {
    score: {
      faction1: number;
      faction2: number;
    };
  };
  started_at?: number;
  finished_at?: number;
}

export interface EnrichedMatch extends HistoryMatch {
  mapName?: string;
  mapImage?: string;
}

export const FALLBACK_MAP_IMG = '/cs2-map-fallback.jpg';