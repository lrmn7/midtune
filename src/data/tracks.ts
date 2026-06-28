import type { Track } from "@/types";
export const tracks: Track[] = [
  {
    id: "drowning-in-my-own-wave",
    title: "drowning in my own wave",
    author: "L RMN",
    year: "2024-08-27",
    bpm: 92,
    duration: "3:42",
    durationSec: 222,
    moods: ["melancholy", "nostalgic"],
    tuning: "G",
    downloads: 1248,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "kitchen-light-at-2am",
    title: "kitchen light at 2am",
    author: "L RMN",
    year: "2024-06-14",
    bpm: 78,
    duration: "2:58",
    durationSec: 178,
    moods: ["quiet", "lonely"],
    tuning: "C",
    downloads: 892,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "porch-letters",
    title: "porch letters",
    author: "L RMN",
    year: "2023-09-03",
    bpm: 104,
    duration: "4:11",
    durationSec: 251,
    moods: ["bittersweet", "warm"],
    tuning: "E",
    downloads: 2103,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "blue-hour-on-the-overpass",
    title: "blue hour on the overpass",
    author: "L RMN",
    year: "2023-04-18",
    bpm: 84,
    duration: "5:03",
    durationSec: 303,
    moods: ["dreamy", "melancholy"],
    tuning: "D",
    downloads: 651,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "grocery-store-parking-lot",
    title: "grocery store parking lot",
    author: "L RMN",
    year: "2022-11-22",
    bpm: 96,
    duration: "3:21",
    durationSec: 201,
    moods: ["nostalgic", "lonely"],
    tuning: "E",
    downloads: 1577,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "yearbook-photo",
    title: "yearbook photo",
    author: "L RMN",
    year: "2022-05-09",
    bpm: 132,
    duration: "2:44",
    durationSec: 164,
    moods: ["bittersweet", "energetic"],
    tuning: "A",
    downloads: 988,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "screen-door-summer",
    title: "screen door summer",
    author: "L RMN",
    year: "2021-07-30",
    bpm: 72,
    duration: "4:48",
    durationSec: 288,
    moods: ["warm", "dreamy"],
    tuning: "G",
    downloads: 432,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
  {
    id: "first-snow-no-jacket",
    title: "first snow, no jacket",
    author: "L RMN",
    year: "2021-01-12",
    bpm: 88,
    duration: "3:30",
    durationSec: 210,
    moods: ["melancholy", "cold"],
    tuning: "D",
    downloads: 1820,
    audioUrl: "https://files.listune.app/drowning%20in%20my%20own%20wave.wav",
  },
];

export const ALL_MOODS = Array.from(new Set(tracks.flatMap((t) => t.moods))).sort();

export const ALL_KEYS = Array.from(new Set(tracks.map((t) => t.tuning))).sort();

export const ALL_YEARS = Array.from(
  new Set(tracks.map((t) => t.year.slice(0, 4)))
).sort((a, b) => Number(b) - Number(a));

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getTotalDownloads(): number {
  return tracks.reduce((sum, t) => sum + t.downloads, 0);
}

export function formatReleaseDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
