import { FaWindows } from "react-icons/fa"
import { FaApple } from "react-icons/fa"
import { FaLinux } from "react-icons/fa"
import { FaAndroid } from "react-icons/fa"
import { FaGlobe } from "react-icons/fa"
import { IoLogoApple } from "react-icons/io5"

enum osTypes {
  WINDOWS = 0,
  LINUX = 1,
  MACOS = 2,
  ANDROID = 3,
  IOS = 4,
  WEB = 5
}

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

export const products = (t: (key: string) => string) => [
  {
    name: t('main.products.trader.title'),
    title: t('main.products.trader.short_description'),
    description: t('main.products.trader.description'),
    icon: '/assets/brand/agm-logo-circle.png',
    download_url: '/downloads/trader',
    platforms: [
      { type: 'Windows', icon: FaWindows, osType: osTypes.WINDOWS },
      { type: 'Mac', icon: FaApple, osType: osTypes.MACOS },
      { type: 'Linux', icon: FaLinux, osType: osTypes.LINUX },
    ],
    downloadOptions: AGMTraderProDownloads,
  },
  {
    name: t('main.products.mobile.title'),
    title: t('main.products.mobile.short_description'),
    description: t('main.products.mobile.description'),
    icon: '/assets/brand/agm-logo-circle.png',
    download_url: '/downloads/mobile',
    platforms: [
      { type: 'Android', icon: FaAndroid, osType: osTypes.ANDROID },
      { type: 'iOS', icon: FaApple, osType: osTypes.IOS },
    ],
    downloadOptions: AGMTraderMobileDownloads,
  },
  {
    name: t('main.products.web_portal.title'),
    title: t('main.products.web_portal.short_description'),
    description: t('main.products.web_portal.description'),
    icon: '/assets/brand/agm-logo-circle.png',
    download_url: 'https://www.clientam.com/sso/Login?partnerID=agmbvi2022',
    isExternal: true,
    platforms: [
      { type: 'Web', icon: FaGlobe, osType: osTypes.WEB },
    ]
  }
]
