export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface PlayerData {
  name: string;
  handle: string;
  role: string;
  team: string;
  teamLogo: string;
  image: string;
  imageScale: number;
  bio: string;
  socials: SocialLink[];
  youtubeChannelId: string;
  achievements: string[];
  stats: {
    label: string;
    value: string;
  }[];
}
