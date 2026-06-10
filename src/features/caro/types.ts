export type Player = "human" | "ai";

export type Cell = Player | null;

export type Board = Cell[][];

export type Position = { row: number; col: number };

export type WinLength = 5 | 6;

export type AiDifficulty =
  | "basic"
  | "normal"
  | "hard"
  | "master"
  | "genius";

export type CardRarity = "common" | "rare" | "epic" | "legendary";

export type DrawAnimation = {
  card: SkillCard;
  for: Player;
};

export type SkillCardType =
  | "block"
  | "swap"
  | "scout"
  | "unseal"
  | "peek"
  | "blink"
  | "mend"
  | "mark"
  | "fog"
  | "spark"
  | "chain"
  | "double_step"
  | "surge"
  | "shield"
  | "undo"
  | "barrier"
  | "inspire"
  | "grapple"
  | "recall"
  | "rust"
  | "remove"
  | "domination"
  | "curse"
  | "decay"
  | "sabotage"
  | "quake"
  | "snipe"
  | "triple_step"
  | "apocalypse"
  | "fortify"
  | "oblivion";

export type SkillCard = {
  id: string;
  type: SkillCardType;
};

export type GamePhase =
  | "playing"
  | "select_skill_target"
  | "select_discard"
  | "extra_move"
  | "ai_thinking"
  | "ai_skill_flash"
  | "drawing_card"
  | "game_over";

export type GameState = {
  board: Board;
  blockedCells: string[];
  shieldedCells: string[];
  currentPlayer: Player;
  phase: GamePhase;
  activeSkill: SkillCard | null;
  humanHand: SkillCard[];
  aiHand: SkillCard[];
  winner: Player | null;
  message: string;
  lastMove: Position | null;
  moveHistory: { pos: Position; player: Player }[];
  extraMovesRemaining: number;
  aiExtraMovesRemaining: number;
  turnCount: number;
  skillSource: Position | null;
  winLength: WinLength;
  aiDifficulty: AiDifficulty;
  deck: SkillCardType[];
  drawAnimation: DrawAnimation | null;
  aiSkillFlash: SkillCard | null;
  discardPicks: string[];
  mulliganUsedThisTurn: boolean;
  scoutHighlight: Position | null;
  aiCursed: boolean;
};
