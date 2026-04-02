export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface PlayerData {
  name: string;
  handle: string;
  handlePrefix: string;
  role: string;
  team: string;
  teamLogo: string;
  image: string;
  imageScale: number;
  textOffset: number;
  leftLogoUrl: string;
  leftLogoScale: number;
  rightLogoUrl: string;
  rightLogoScale: number;
  bio: string;
  socials: SocialLink[];
  youtubeChannelId: string;
  achievements: string[];
  stats: {
    label: string;
    value: string;
  }[];
}
