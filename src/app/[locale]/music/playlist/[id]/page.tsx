import { PlaylistDetailPageClient } from "@/features/music/playlist/playlist-detail-page-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PlaylistDetailPage({ params }: Props) {
  const { id } = await params;

  return <PlaylistDetailPageClient playlistId={id} />;
}
