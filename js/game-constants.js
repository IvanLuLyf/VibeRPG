// BunnyRPG engine constants — load before js/BunnyRPG/Engine.js (see index.html).
const CURRENT_VERSION = "0.1pre 20130317";

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

const TILES_ON_SCREEN_X = 13;
const TILES_ON_SCREEN_Y = 11;

const GAME_VIEW_WIDTH = TILES_ON_SCREEN_X * TILE_WIDTH;
const GAME_VIEW_HEIGHT = TILES_ON_SCREEN_Y * TILE_HEIGHT;

/** Menu selection arrow — tight clear box so moving pointer does not erase the next line (title menu line gap ≈28px). */
const MENU_ARROW_CLEAR_W = 14;
const MENU_ARROW_CLEAR_H = 15;

const MIN_SCREEN_SQUARE_X = 5;
const MAX_SCREEN_SQUARE_X = 7;
const MIN_SCREEN_SQUARE_Y = 4;
const MAX_SCREEN_SQUARE_Y = 6;

const SPRITE_WIDTH = 32;
/** Walk-sheet frame height (4 rows × this = texture height). Extra space above the foot tile for hair/staff (~2 map tiles). */
const SPRITE_HEIGHT = 96;
/** Battle UI draws only the bottom strip of each walk frame (classic ~48px body). */
const BATTLE_PLAYER_SPRITE_SRC_H = 48;

const FPS = 30;
const SCROLL_FACTOR = 4;
/** Estimated ms for one grid step (player walk is ~7 internal frames at 1000/FPS each). */
const PLAYER_WALK_STEP_MS = Math.ceil(7 * (1000 / FPS));
/** How often we retry a held direction on the field (must be < step duration to avoid gaps). */
const FIELD_MOVE_POLL_MS = 40;
const BATTLE_FREQ = 0.14;
const MESSAGE_DELAY = 500;

/** Battle UI (Pokémon-style bottom command bar + HUD). */
const BATTLE_BOTTOM_PANEL_H = 120;
const BATTLE_CMD_AREA_W = 200;
const BATTLE_LOG_X = BATTLE_CMD_AREA_W + 14;
const BATTLE_ENEMY_SPRITE_Y = 64;
const BATTLE_PLAYER_SPRITE_X = 28;

/** Canvas menu / dialog typography (system stack for CJK + Latin). */
const MENU_FONT_MAIN =
    '600 18px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
const MENU_FONT_SMALL =
    '500 14px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
const MENU_FONT_TITLE =
    '600 20px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
