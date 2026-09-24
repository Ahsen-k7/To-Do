import type { ReactNode } from "react";

export type IconName="check"|"arrow"|"plus"|"sun"|"list"|"grid"|"calendar"|"spark"|"flag";
export function Icon({ name,className="" }: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName,ReactNode>={
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>,
    plus: <path d="M12 5v14M5 12h14" />,
    sun: <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>,
    list: <>
      <path d="M9 6h11M9 12h11M9 18h11M3 6h1M3 12h1M3 18h1" />
    </>,
    grid: <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>,
    calendar: <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 3v4m10-4v4M3 11h18m-13 5h3" />
    </>,
    spark: <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" />,
    flag: <>
      <path d="M5 21V4c5-4 9 4 14 0v10c-5 4-9-4-14 0" />
    </>,
  };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
