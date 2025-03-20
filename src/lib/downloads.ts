import { FaWindows, FaApple, FaLinux, FaAndroid } from 'react-icons/fa';
import { IoLogoApple } from "react-icons/io5";

export type DownloadOption = {
  os: string;
  icon: typeof FaWindows;
  versions: {
    arch: string;
    url: string;
    recommended?: boolean;
  }[];
};

export const downloads: DownloadOption[] = [
  {
    os: 'Windows',
    icon: FaWindows,
    versions: [
      {
        arch: '64-bit',
        url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-windows-x64.exe',
        recommended: true,
      },
      {
        arch: '32-bit',
        url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-windows-x86.exe',
      },
    ],
  },
  {
    os: 'macOS',
    icon: FaApple,
    versions: [
      {
        arch: '64-bit',
        url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-macosx-x64.dmg',
        recommended: true,
      },
    ],
  },
  {
    os: 'Linux',
    icon: FaLinux,
    versions: [
      {
        arch: '64-bit',
        url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-linux-x64.sh',
        recommended: true,
      },
      {
        arch: '32-bit',
        url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-linux-x86.sh',
      },
    ],
  },
  {
    os: 'iOS',
    icon: IoLogoApple,
    versions: [
      {
        arch: 'App Store',
        url: '#', // Placeholder for iOS App Store link
        recommended: true,
      },
    ],
  },
  {
    os: 'Android',
    icon: FaAndroid,
    versions: [
      {
        arch: 'Play Store',
        url: '#', // Placeholder for Play Store link
        recommended: true,
      },
    ],
  },
]; 