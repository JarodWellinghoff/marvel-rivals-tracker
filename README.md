# Marvel Rivals Companion

An Overwolf companion app for **Marvel Rivals** that consumes real-time game events via the Overwolf Game Events Provider (GEP).

Based on the [Overwolf events-sample-app](https://github.com/overwolf/events-sample-app), narrowed to Marvel Rivals (Game ID `24890`) only.

## Supported GEP Features

All features align with the [official Marvel Rivals GEP documentation](https://dev.overwolf.com/ow-electron/live-game-data-gep/supported-games/marvel-rivals).

### `game_info` — Info Updates

| Key           | Description                      |
| ------------- | -------------------------------- |
| `scene`       | Current scene (`Lobby`/`Ingame`) |
| `player_name` | Local player's display name      |
| `player_id`   | Local player's ID                |

### `match_info` — Info Updates

| Key                       | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `roster_xx`               | Full roster data per player (uid, character, team, K/D/A, ult charge, elo) |
| `match_id`                | Current match ID                                                           |
| `game_type`               | Practice / Quick match / Competitive / Arcade                              |
| `game_mode`               | Current game mode name                                                     |
| `game_mode_id`            | Current game mode ID                                                       |
| `map`                     | Current map name                                                           |
| `player_stats`            | Damage dealt, blocked, accuracy, healing                                   |
| `match_outcome`           | Victory / Defeat / Draw                                                    |
| `banned_characters`       | Banned characters with IDs and team affiliation                            |
| `ability_cooldown_X`      | Ability cooldown timer (seconds) by UI slot index                          |
| `additional_ability_cd_X` | Team-up ability cooldown timer (seconds)                                   |
| `objective_progress`      | Mode-specific objective data (Convoy/Convergence/Domination)               |
| `selected_character`      | Highlighted/selected character during selection                            |

### `match_info` — Events

| Event         | Data                          | Description                        |
| ------------- | ----------------------------- | ---------------------------------- |
| `match_start` | —                             | Match started                      |
| `match_end`   | —                             | Match ended                        |
| `round_start` | —                             | Round started                      |
| `round_end`   | —                             | Round ended                        |
| `kill`        | Total kill count              | Local player killed another player |
| `death`       | Total death count             | Local player died                  |
| `assist`      | Total assist count            | Local player assisted              |
| `kill_feed`   | `{ attacker, victim }` (JSON) | Any player death in the match      |

## Game Compliance

NetEase's compliance policy **prevents** giving users confidential information such as damage/healing statistics of other players, selectively banning heroes, or predicting opponents' ultimate abilities. This app respects those restrictions.

## Getting Started

```bash
yarn          # Install dependencies
yarn start    # Build in development mode (watch)
yarn build    # Production build
```

## Hotkey

**Ctrl+G** — Toggle the in-game overlay (configurable in manifest.json)

## Project Structure

```
src/
├── constants/
│   └── window-names.ts          # Window name + game ID constants
├── overwolf-platform/
│   ├── config/
│   │   └── game-data.ts         # Marvel Rivals GEP feature config
│   ├── consumers/
│   │   └── gep-consumer.ts      # Typed event/info handlers
│   └── services/                # Overwolf platform services
├── types/
│   ├── marvel-rivals-gep.ts     # TypeScript types for Rivals GEP data
│   └── services/                # Service base types
└── windows/
    ├── index.ts                 # Background controller
    └── in-game.ts               # In-game overlay controller
```

## References

- [Marvel Rivals GEP Documentation](https://dev.overwolf.com/ow-electron/live-game-data-gep/supported-games/marvel-rivals)
- [Overwolf Electron API Overview](https://dev.overwolf.com/ow-electron/reference/Overwolf-electron-APIs/Overview)
- [GEP Events Health Status](https://dev.overwolf.com/ow-electron/live-game-data-gep/game-events-status-health)

