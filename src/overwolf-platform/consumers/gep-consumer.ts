import { injectable } from 'tsyringe';
import {
  GEPErrorPayload,
  GameEventPayload,
  InfoUpdatePayload,
} from '../../types/services/gep-service-base';
import {
  RivalsRosterEntry,
  RivalsPlayerStats,
  RivalsBannedCharacter,
  RivalsObjectiveProgress,
  RivalsSelectedCharacter,
  RivalsKillFeedEntry,
  RivalsScene,
  RivalsGameType,
  RivalsMatchOutcome,
} from '../../types/marvel-rivals-gep';

/**
 * Marvel Rivals GEP Consumer
 *
 * Handles all game events and info updates specific to Marvel Rivals.
 * Parses the documented data shapes so downstream code receives typed objects.
 *
 * @see https://dev.overwolf.com/ow-electron/live-game-data-gep/supported-games/marvel-rivals
 */
@injectable()
export class GEPConsumer {
  // -------------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------------

  /**
   * Consumes errors fired by the Overwolf GEP
   */
  public onGEPError(error: GEPErrorPayload) {
    console.error(`[Marvel Rivals GEP] Error: ${prettify(error.reason)}`);
  }

  // -------------------------------------------------------------------------
  // Info Updates (match_info + game_info)
  // -------------------------------------------------------------------------

  /**
   * Consumes game info updates fired by the Overwolf GEP.
   *
   * Routes each update to a typed handler based on its category and key.
   */
  public onGameInfoUpdate(info: InfoUpdatePayload) {
    const feature = info.feature;

    Object.keys(info.info).forEach((categoryKey) => {
      // @ts-expect-error incomplete underlying typings
      const category = info.info[categoryKey];

      Object.keys(category).forEach((key) => {
        const raw = category[key];

        // Route to typed handlers
        if (categoryKey === 'match_info') {
          handleMatchInfoUpdate(key, raw);
        } else if (categoryKey === 'game_info') {
          handleGameInfoUpdate(key, raw);
        }

        // Always log the raw update for debugging
        console.log(
          `[Marvel Rivals GEP] Info Update: ` +
            `{"feature": "${feature}", "category": "${categoryKey}", ` +
            `"key": "${key}", "data": ${prettify(raw)}}`,
        );
      });
    });
  }

  // -------------------------------------------------------------------------
  // Game Events (match lifecycle, kills, deaths, assists, kill feed)
  // -------------------------------------------------------------------------

  /**
   * Consumes game events fired by the Overwolf GEP.
   *
   * Routes each event to a typed handler based on its name.
   */
  public onNewGameEvent(event: GameEventPayload) {
    event.events.forEach((ev) => {
      const name = ev.name;
      const data = ev.data;

      switch (name) {
        case 'match_start':
          onMatchStart();
          break;
        case 'match_end':
          onMatchEnd();
          break;
        case 'round_start':
          onRoundStart();
          break;
        case 'round_end':
          onRoundEnd();
          break;
        case 'kill':
          onKill(typeof data === 'number' ? data : parseInt(data as string));
          break;
        case 'death':
          onDeath(typeof data === 'number' ? data : parseInt(data as string));
          break;
        case 'assist':
          onAssist(typeof data === 'number' ? data : parseInt(data as string));
          break;
        case 'kill_feed':
          onKillFeed(safeParse<RivalsKillFeedEntry>(data as string));
          break;
        default:
          console.log(
            `[Marvel Rivals GEP] Unhandled event: ${name} — ${prettify(data)}`,
          );
      }
    });
  }
}

// ===========================================================================
// match_info update handlers
// ===========================================================================

function handleMatchInfoUpdate(key: string, raw: unknown) {
  // Roster entries are keyed as roster_0 through roster_11
  if (key.startsWith('roster_')) {
    const roster = safeParse<RivalsRosterEntry>(raw as string);
    if (roster) onRosterUpdate(key, roster);
    return;
  }

  switch (key) {
    case 'match_id':
      console.log(`[Rivals] Match ID: ${raw}`);
      break;
    case 'game_type':
      console.log(`[Rivals] Game type: ${raw as RivalsGameType}`);
      break;
    case 'game_mode':
      console.log(`[Rivals] Game mode: ${raw}`);
      break;
    case 'game_mode_id':
      console.log(`[Rivals] Game mode ID: ${raw}`);
      break;
    case 'map':
      console.log(`[Rivals] Map: ${raw}`);
      break;
    case 'player_stats': {
      const stats = safeParse<RivalsPlayerStats>(raw as string);
      if (stats) onPlayerStats(stats);
      break;
    }
    case 'match_outcome':
      console.log(`[Rivals] Match outcome: ${raw as RivalsMatchOutcome}`);
      break;
    case 'banned_characters': {
      const bans = safeParse<RivalsBannedCharacter[]>(raw as string);
      if (bans) onBannedCharacters(bans);
      break;
    }
    case 'objective_progress': {
      const progress = safeParse<RivalsObjectiveProgress>(raw as string);
      if (progress) onObjectiveProgress(progress);
      break;
    }
    case 'selected_character': {
      const chars = safeParse<RivalsSelectedCharacter[]>(raw as string);
      if (chars) onSelectedCharacter(chars);
      break;
    }
    default:
      // Handle ability_cooldown_X and additional_ability_cd_X dynamically
      if (key.startsWith('ability_cooldown_')) {
        const index = key.replace('ability_cooldown_', '');
        console.log(`[Rivals] Ability ${index} cooldown: ${raw}s`);
      } else if (key.startsWith('additional_ability_cd_')) {
        const index = key.replace('additional_ability_cd_', '');
        console.log(`[Rivals] Team-up ability ${index} cooldown: ${raw}s`);
      }
      break;
  }
}

// ===========================================================================
// game_info update handlers
// ===========================================================================

function handleGameInfoUpdate(key: string, raw: unknown) {
  switch (key) {
    case 'scene':
      console.log(`[Rivals] Scene changed: ${raw as RivalsScene}`);
      break;
    case 'player_name':
      console.log(`[Rivals] Player name: ${raw}`);
      break;
    case 'player_id':
      console.log(`[Rivals] Player ID: ${raw}`);
      break;
    default:
      console.log(`[Rivals] Unknown game_info key: ${key} — ${prettify(raw)}`);
  }
}

// ===========================================================================
// Typed event callbacks — extend these with your app logic
// ===========================================================================

function onMatchStart() {
  console.log('[Rivals] >>> Match started');
}

function onMatchEnd() {
  console.log('[Rivals] >>> Match ended');
}

function onRoundStart() {
  console.log('[Rivals] >>> Round started');
}

function onRoundEnd() {
  console.log('[Rivals] >>> Round ended');
}

function onKill(totalKills: number) {
  console.log(`[Rivals] Kill! Total kills: ${totalKills}`);
}

function onDeath(totalDeaths: number) {
  console.log(`[Rivals] Death. Total deaths: ${totalDeaths}`);
}

function onAssist(totalAssists: number) {
  console.log(`[Rivals] Assist. Total assists: ${totalAssists}`);
}

function onKillFeed(entry: RivalsKillFeedEntry | null) {
  if (entry) {
    console.log(
      `[Rivals] Kill feed: ${entry.attacker} eliminated ${entry.victim}`,
    );
  }
}

function onRosterUpdate(slotKey: string, roster: RivalsRosterEntry) {
  console.log(
    `[Rivals] Roster ${slotKey}: ${roster.name} playing ${roster.character_name} ` +
      `(Team ${roster.team}, ${roster.is_teammate ? 'ally' : 'enemy'}) ` +
      `K/D/A: ${roster.kills}/${roster.deaths}/${roster.assists}`,
  );
}

function onPlayerStats(stats: RivalsPlayerStats) {
  console.log(
    `[Rivals] Player stats — Damage: ${stats.damage_dealt}, ` +
      `Blocked: ${stats.damage_block}, Accuracy: ${stats.accuracy}%, ` +
      `Healing: ${stats.total_heal}`,
  );
}

function onBannedCharacters(bans: RivalsBannedCharacter[]) {
  const names = bans.map(
    (b) => `${b.character_name} (${b.is_teammate ? 'ally' : 'enemy'} ban)`,
  );
  console.log(`[Rivals] Banned characters: ${names.join(', ')}`);
}

function onObjectiveProgress(progress: RivalsObjectiveProgress) {
  console.log(
    `[Rivals] Objective (${progress.game_mode}): ` +
      `Checkpoint ${progress.checkpoint}, Team: ${progress.team}` +
      (progress.game_mode === 'Domination'
        ? `, Left: ${progress.left_capture}%, Right: ${progress.right_capture}%`
        : ''),
  );
}

function onSelectedCharacter(chars: RivalsSelectedCharacter[]) {
  const names = chars.map((c) => c.character_name);
  console.log(`[Rivals] Selected character: ${names.join(', ')}`);
}

// ===========================================================================
// Utilities
// ===========================================================================

/**
 * Safely parse a JSON string, returning null on failure.
 */
function safeParse<T>(data: unknown): T | null {
  if (typeof data !== 'string') return data as T;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

/**
 * Format/prettify GEP data for logging/display
 */
const prettify = (data: unknown): string => {
  return JSON.stringify(data, undefined, 4);
};

