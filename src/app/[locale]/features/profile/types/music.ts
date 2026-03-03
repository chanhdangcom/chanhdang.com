export type IMusicStatus = "pending" | "approved" | "rejected";

export type IMusic = {
  id: string;
  _id?: string;
  title: string;
  singer: string;
  cover: string;
  audio: string;
  youtube: string;
  content: string;
  type?: string;
  topic?: string;
  srt?: string;
  beat?: string;
  playCount?: number;
  createdAt?: Date;
  /**
   * Trạng thái duyệt bài hát.
   * - "pending": chờ admin duyệt
   * - "approved": đã được duyệt và hiển thị công khai
   * - "rejected": đã bị từ chối
   */
  status?: IMusicStatus;
  /** ID admin duyệt (nếu có) */
  approvedBy?: string | null;
  /** Thời gian được duyệt (nếu có) */
  approvedAt?: Date | null;
  /** ID user đã thêm bài hát */
  addedBy?: string | null;
};
