import { PlayerData } from "./types";

export const PLAYER_DATA: PlayerData = {
  name: "Alexander 'Xenon' Rivers",
  handle: "XENON",
  role: "Entry Fragger / IGL",
  team: "GOLDEN PHOENIX",
  teamLogo: "https://picsum.photos/seed/phoenix/200/200",
  image: "",
  imageScale: 1,
  textOffset: -80,
  bio: "Professional FPS player with over 5 years of competitive experience. Known for aggressive entry fragging and strategic mid-round calling. Multiple-time major finalist and MVP.",
  socials: [
    { platform: "Twitter", url: "https://twitter.com", icon: "Twitter" },
    { platform: "Instagram", url: "https://instagram.com", icon: "Instagram" },
    { platform: "Twitch", url: "https://twitch.tv", icon: "Twitch" },
    { platform: "YouTube", url: "https://youtube.com", icon: "Youtube" },
  ],
  youtubeChannelId: "UC_x5XG1OV2P6uYZ5gzmaUXA", // Placeholder
  achievements: [
    "1st Place - World Championship 2025",
    "MVP - Summer Masters 2024",
    "2nd Place - Pro League Season 12",
  ],
  stats: [
    { label: "Win Rate", value: "68%" },
    { label: "K/D Ratio", value: "1.42" },
    { label: "Headshot %", value: "54%" },
    { label: "Matches", value: "1,240" },
  ],
};
