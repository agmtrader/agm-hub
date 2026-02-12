import { SVGProps } from "react";

export interface DualMonitorProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  srcLeft?: string;
  srcRight?: string;
}

export default function DualMonitor({
  width = 940,
  height = 440,
  srcLeft,
  srcRight,
  ...props
}: DualMonitorProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 940 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* ===== LEFT MONITOR ===== */}
      {/* Body outer - flat right edge */}
      <path
        d="M30 0H470V350H30C13.431 350 0 336.569 0 320V30C0 13.431 13.431 0 30 0Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      {/* Body inner */}
      <path
        d="M30 4H466V346H30C17.85 346 4 336.15 4 324V26C4 13.85 17.85 4 30 4Z"
        className="fill-white dark:fill-[#262626]"
      />
      {/* Screen */}
      <path
        d="M22 14H456V324H22C17.582 324 14 320.418 14 316V22C14 17.582 17.582 14 22 14Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      {/* Left image content */}
      {srcLeft && (
        <image
          href={srcLeft}
          x="14"
          y="14"
          width="442"
          height="310"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#dualMonitorLeftClip)"
        />
      )}
      {/* Camera dot */}
      <circle cx="235" cy="8" r="3" className="fill-[#D4D4D4] dark:fill-[#525252]" />
      <circle cx="235" cy="8" r="1.5" className="fill-[#E5E5E5] dark:fill-[#404040]" />
      {/* Chin indicator */}
      <rect x="210" y="332" width="50" height="4" rx="2" ry="2" className="fill-[#D4D4D4] dark:fill-[#525252]" opacity="0.5" />

      {/* ===== RIGHT MONITOR ===== */}
      {/* Body outer - flat left edge */}
      <path
        d="M470 0H910C926.569 0 940 13.431 940 30V320C940 336.569 926.569 350 910 350H470V0Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      {/* Body inner */}
      <path
        d="M474 4H910C922.15 4 936 13.85 936 26V324C936 336.15 922.15 346 910 346H474V4Z"
        className="fill-white dark:fill-[#262626]"
      />
      {/* Screen */}
      <path
        d="M484 14H918C922.418 14 926 17.582 926 22V316C926 320.418 922.418 324 918 324H484V14Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      {/* Right image content */}
      {srcRight && (
        <image
          href={srcRight}
          x="484"
          y="14"
          width="442"
          height="310"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#dualMonitorRightClip)"
        />
      )}
      {/* Camera dot */}
      <circle cx="705" cy="8" r="3" className="fill-[#D4D4D4] dark:fill-[#525252]" />
      <circle cx="705" cy="8" r="1.5" className="fill-[#E5E5E5] dark:fill-[#404040]" />
      {/* Chin indicator */}
      <rect x="680" y="332" width="50" height="4" rx="2" ry="2" className="fill-[#D4D4D4] dark:fill-[#525252]" opacity="0.5" />

      {/* ===== SHARED STAND ===== */}
      {/* Stand neck */}
      <path
        d="M435 350H505V440H435V350Z"
        className="fill-[#D4D4D4] dark:fill-[#525252]"
      />
      {/* Stand neck inner */}
      <path
        d="M440 350H500V440H440V350Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />

      <defs>
        <clipPath id="dualMonitorLeftClip">
          <path d="M22 14H456V324H22C17.582 324 14 320.418 14 316V22C14 17.582 17.582 14 22 14Z" />
        </clipPath>
        <clipPath id="dualMonitorRightClip">
          <path d="M484 14H918C922.418 14 926 17.582 926 22V316C926 320.418 922.418 324 918 324H484V14Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
