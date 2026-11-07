// The video of the casa of the catalyst, made from the recording of the binary: a loop with no sound, in WebM and in MP4, with a
// picture of the casa for the poster. Its size is the one of the files, so the page keeps its place before it comes.
import mp4 from "@/content/videos/casa.mp4?url";
import poster from "@/content/videos/casa-poster.png?url";
import webm from "@/content/videos/casa.webm?url";

export const CASA_VIDEO = { webm, mp4, poster, width: 1600, height: 1244 } as const;
