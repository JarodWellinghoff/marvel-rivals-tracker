/**
 * Marvel Rivals GEP Type Definitions
 *
 * Typed structures for all info updates and events documented at:
 * https://dev.overwolf.com/ow-electron/live-game-data-gep/supported-games/marvel-rivals
 */

// ---------------------------------------------------------------------------
// match_info: Info Updates
// ---------------------------------------------------------------------------

/**
 * Roster entry for a single player (roster_0 through roster_11).
 * The index changes dynamically — track players by `uid` or `name`.
 *
 * Note: In Competitive mode (Diamond 3+), names are hidden as "*****"
 * until the round begins. Players with the hidden-names option enabled
 * remain hidden even after the round starts.
 */
export interface RivalsRosterEntry {
  uid: string;
  name: string;
  character_id: string;
  character_name: string;
  team: number;
  is_teammate: boolean;
  is_local: boolean;
  is_alive: boolean;
  kills: number;
  deaths: number;
  assists: number;
  /** Ultimate charge percentage (teammates only) */
  ult_charge: number;
  elo_score: number;
}

/** Possible game types returned by the `game_type` info update */
export type RivalsGameType =
  | 'Practice'
  | 'Quick match'
  | 'Competitive'
  | 'Arcade'
  | 'UNKNOWN';

/** Possible match outcomes */
export type RivalsMatchOutcome = 'Victory' | 'Defeat' | 'Draw';

/** Local player statistics during a match */
export interface RivalsPlayerStats {
  damage_dealt: number;
  damage_block: number;
  accuracy: number;
  total_heal: number;
}

/** A banned character entry */
export interface RivalsBannedCharacter {
  character_id: string;
  character_name: string;
  is_teammate: boolean;
}

/** Objective progress for different game modes */
export interface RivalsObjectiveProgress {
  game_mode: 'Convoy' | 'Convergence' | 'Domination';
  checkpoint: number;
  /** Capture percentage for left point (Domination only) */
  left_capture: number;
  /** Capture percentage for right point (Domination only) */
  right_capture: number;
  team: 'Defense' | 'Attacker';
}

/** A selected/highlighted character entry */
export interface RivalsSelectedCharacter {
  character_id: number;
  character_name: string;
}

// ---------------------------------------------------------------------------
// game_info: Info Updates
// ---------------------------------------------------------------------------

/** Possible scene values */
export type RivalsScene = 'Lobby' | 'Ingame';

// ---------------------------------------------------------------------------
// match_info: Events
// ---------------------------------------------------------------------------

/** Kill feed entry fired whenever any player dies in the match */
export interface RivalsKillFeedEntry {
  attacker: string;
  victim: string;
}

/**
 * Union of all Marvel Rivals GEP event names.
 *
 * Events:
 * - match_start / match_end — match lifecycle
 * - round_start / round_end — round lifecycle
 * - death — local player death (data = total death count)
 * - kill  — local player kill  (data = total kill count)
 * - assist — local player assist (data = total assist count)
 * - kill_feed — any player death in the match
 */
export type RivalsEventName =
  | 'match_start'
  | 'match_end'
  | 'round_start'
  | 'round_end'
  | 'death'
  | 'kill'
  | 'assist'
  | 'kill_feed';
