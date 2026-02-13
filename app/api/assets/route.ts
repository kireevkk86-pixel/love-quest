import { NextResponse } from "next/server";
  import { promises as fs } from "fs";
  import path from "path";

  const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const MUSIC_EXTENSIONS = new Set([".mp3", ".ogg", ".wav"]);

  const safeReadDir = async (dirPath: string) => {
    try {
      return await fs.readdir(dirPath);
    } catch {
      return [] as string[];
    }
  };

  const isSupported = (filename: string, extensions: Set<string>) => {
    return extensions.has(path.extname(filename).toLowerCase());
  };

  const toPublicUrl = (folder: "photos" | "music", filename: string) => {
    return `/${folder}/${encodeURIComponent(filename)}`;
  };

  export async function GET() {
    const publicDir = path.join(process.cwd(), "public");
    const photosDir = path.join(publicDir, "photos");
    const musicDir = path.join(publicDir, "music");

    const photoFiles = (await safeReadDir(photosDir))
      .filter((file) => isSupported(file, IMAGE_EXTENSIONS))
      .sort((a, b) => a.localeCompare(b, "ru", { sensitivity: "base" }));

    const musicFiles = (await safeReadDir(musicDir))
      .filter((file) => isSupported(file, MUSIC_EXTENSIONS))
      .sort((a, b) => a.localeCompare(b, "ru", { sensitivity: "base" }));

    let musicFile: string | null = null;

    try {
      await fs.access(path.join(musicDir, "song.mp3"));
      musicFile = "song.mp3";
    } catch {
      musicFile = musicFiles[0] ?? null;
    }

    return NextResponse.json({
      photos: photoFiles.map((file) => toPublicUrl("photos", file)),
      music: musicFile ? toPublicUrl("music", musicFile) : null,
    });
  }
