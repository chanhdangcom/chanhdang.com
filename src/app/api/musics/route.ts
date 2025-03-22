import { MUSICS } from "@/features/music/data/music-page";
import { IMusic } from "@/features/profile/types/music";

const DB_MUSICS: IMusic[] = MUSICS;

function getMusics() {
  // get musics from database
  return DB_MUSICS;
}

function createMusic(music: IMusic) {
  // save music to database
  DB_MUSICS.push(music);

  return music;
}

export async function GET() {
  const musics = getMusics();
  return Response.json(musics);
}

export async function POST(request: Request) {
  const body = await request.json();

  const music = body as IMusic;
  const createdMusic = createMusic(music);

  return Response.json(createdMusic);
}
