import { NextResponse } from 'next/server';
import { MUSICS } from '@/features/music/data/music-page';

export async function GET() {
  return NextResponse.json(MUSICS);
}
