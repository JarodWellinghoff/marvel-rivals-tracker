/**
 * Marvel Rivals Game ID
 *
 * @see https://dev.overwolf.com/ow-electron/live-game-data-gep/supported-games/marvel-rivals
 */
export const MARVEL_RIVALS_GAME_ID = 24890;

/**
 * All GEP features available for Marvel Rivals.
 *
 * Features:
 * - gep_internal: Internal GEP events
 * - match_info: Roster, match ID, game type/mode, map, player stats,
 *               match outcome, banned characters, ability cooldowns,
 *               objective progress, game mode ID, selected character
 * - game_info: Scene (Lobby/Ingame), player name, player ID
 *
 * @see https://dev.overwolf.com/ow-electron/live-game-data-gep/supported-games/marvel-rivals
 */
export const MARVEL_RIVALS_FEATURES = [
  'gep_internal',
  'match_info',
  'game_info',
];

interface GameData {
  interestedInFeatures: string[];
  description: string;
}

const data: { [id: number]: GameData } = {
  [MARVEL_RIVALS_GAME_ID]: {
    interestedInFeatures: MARVEL_RIVALS_FEATURES,
    description: 'Marvel Rivals data',
  },
};

export default data;

