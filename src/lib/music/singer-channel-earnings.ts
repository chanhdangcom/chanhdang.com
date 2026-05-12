export type SingerChannelEarningsConfig = {
  /** Lượt nghe đầu trên kênh không tính thù lao (ví dụ demo: 100). */
  thresholdPlays: number;
  /** Cứ mỗi `blockPlays` lượt (sau ngưỡng) được tính một khoản `vndPerBlock`. */
  blockPlays: number;
  /** Số tiền VND cho mỗi khối `blockPlays` lượt (sau ngưỡng). */
  vndPerBlock: number;
};

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw?.trim()) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getSingerChannelEarningsConfigFromEnv(): SingerChannelEarningsConfig {
  return {
    thresholdPlays: parsePositiveInt(
      process.env.SINGER_CHANNEL_EARNINGS_THRESHOLD_PLAYS,
      100
    ),
    blockPlays: parsePositiveInt(
      process.env.SINGER_CHANNEL_EARNINGS_BLOCK_PLAYS,
      10
    ),
    vndPerBlock: parsePositiveInt(
      process.env.SINGER_CHANNEL_EARNINGS_VND_PER_BLOCK,
      1000
    ),
  };
}

/**
 * Ước tính thù lao (VND): sau `thresholdPlays` lượt đầu, cứ thêm mỗi `blockPlays` lượt
 * thì cộng thêm `vndPerBlock` (mặc định demo: 100 lượt đầu không tính, sau đó mỗi 10 lượt = 1.000 VND).
 */
export function computeEstimatedChannelVnd(
  totalPlays: number,
  config: SingerChannelEarningsConfig
): number {
  const { thresholdPlays, blockPlays, vndPerBlock } = config;
  const safeTotal = Math.max(0, Math.floor(Number(totalPlays) || 0));
  const excess = Math.max(0, safeTotal - thresholdPlays);
  const blocks = Math.floor(excess / blockPlays);
  return blocks * vndPerBlock;
}
