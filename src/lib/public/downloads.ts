import { FaWindows, FaApple, FaLinux, FaAndroid } from 'react-icons/fa';
import { IoLogoApple } from "react-icons/io5";

export type DownloadOption = {
  os: string;
  icon: typeof FaWindows;
  download_url: string;
};

export const AGMTraderProDownloads: DownloadOption[] = [
  {
    os: 'Windows',
    icon: FaWindows,
    download_url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-windows-x64.exe',
  },
  {
    os: 'macOS',
    icon: FaApple,
    download_url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-macosx-x64.dmg',
  },
  {
    os: 'Linux',
    icon: FaLinux,
    download_url: 'https://download2.interactivebrokers.com/installers/agmtrader/agmtrader/agmtrader-linux-x64.sh',
  }
]; 

export const AGMTraderMobileDownloads: DownloadOption[] = [
  {
    os: 'iOS',
    icon: IoLogoApple,
    download_url: 'https://apps.apple.com/cr/app/agm-trader/id1550920894',
  },
  {
    os: 'Android',
    icon: FaAndroid,
    download_url: 'https://play.google.com/store/apps/details?id=com.clientam.agm.app&hl=en&pli=1',
  },
];