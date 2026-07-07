// Media sources. URLs are env-overridable so the heavy video can move to
// external storage (Vercel Blob / Supabase Storage) without a code change —
// set NEXT_PUBLIC_PROCESS_VIDEO_URL / _POSTER_URL in the Vercel project env.
// Falls back to the bundled files in /public/media for local/dev.

export const PROCESS_VIDEO = {
  src: process.env.NEXT_PUBLIC_PROCESS_VIDEO_URL || "/media/process-signals.mp4",
  poster: process.env.NEXT_PUBLIC_PROCESS_POSTER_URL || "/media/process-signals.jpg",
} as const;

export const HOW_IT_WORKS_VIDEO = {
  src: process.env.NEXT_PUBLIC_HOWITWORKS_VIDEO_URL || "/media/how-it-works.mp4",
  poster: process.env.NEXT_PUBLIC_HOWITWORKS_POSTER_URL || "/media/how-it-works.jpg",
} as const;
