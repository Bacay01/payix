function makeIcon(path, viewBox = "0 0 24 24") {
  return function Icon({ size = 20, strokeWidth = 1.75, className, ...props }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {path}
      </svg>
    );
  };
}

export const ArrowUpRight = makeIcon(<path d="M7 17L17 7M17 7H8M17 7V16" />);

export const Check = makeIcon(<path d="M5 13l4 4L19 7" />);

export const Pencil = makeIcon(
  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" />
);

export const Play = makeIcon(
  <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" stroke="none" />
);

export const Sparkles = makeIcon(
  <>
    <path d="M12 2.5l1.8 5.7 5.7 1.8-5.7 1.8L12 17.5l-1.8-5.7-5.7-1.8 5.7-1.8L12 2.5z" />
    <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" />
  </>
);

export const CircleIcon = makeIcon(<circle cx="12" cy="12" r="8.5" />);

export const ChevronRight = makeIcon(<path d="M9 6l6 6-6 6" />);

export const Cloud = makeIcon(
  <path d="M6.5 19a4.5 4.5 0 0 1-.4-8.98A6 6 0 0 1 17.9 9.1 4.5 4.5 0 0 1 17.5 19h-11z" />
);

export const Users = makeIcon(
  <>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 8a2.8 2.8 0 0 1 0 5.4" />
    <path d="M14.8 19a4.9 4.9 0 0 1 5.7-4.6" />
  </>
);

export const CircleDot = makeIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
  </>
);

export const Menu = makeIcon(<path d="M4 7h16M4 12h16M4 17h16" />);

export const X = makeIcon(<path d="M6 6l12 12M18 6L6 18" />);

export const Moon = makeIcon(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />);

export const Sun = makeIcon(
  <>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.3M12 19.2v2.3M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.4 19.6L6 18M18 6l1.6-1.6" />
  </>
);


export const Zap = makeIcon(
  <path d="M13 2L4.5 13.5h6L11 22l8.5-11.5h-6L13 2z" />
);

export const CreditCard = makeIcon(
  <>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19" />
    <path d="M6.5 14.5h4" />
  </>
);

export const BarChart = makeIcon(
  <path d="M5 20V10M12 20V4M19 20v-7" />
);

export const Globe = makeIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" />
  </>
);

export const Shield = makeIcon(
  <path d="M12 2.5l7.5 3v6c0 4.8-3.2 8.6-7.5 10-4.3-1.4-7.5-5.2-7.5-10v-6l7.5-3z" />
);


export const Eye = makeIcon(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const EyeOff = makeIcon(
  <>
    <path d="M4 4l16 16" />
    <path d="M10.6 6c.5-.1.9-.1 1.4-.1 6 0 9.5 6.1 9.5 6.1a17.6 17.6 0 0 1-2.3 3M14.1 14.1a3 3 0 0 1-4.2-4.2M6.6 6.8C4 8.8 2.5 12 2.5 12S6 18.1 12 18.1c1.2 0 2.3-.2 3.3-.6" />
  </>
);


export const Send = makeIcon(
  <path d="M21 3L10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5 21 3z" />
);

export const Plus = makeIcon(<path d="M12 5v14M5 12h14" />);

export const Bell = makeIcon(
  <>
    <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9z" />
    <path d="M10 20a2.2 2.2 0 0 0 4 0" />
  </>
);

export const Home = makeIcon(
  <path d="M4 10.5L12 3.5l8 7V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5z" />
);

export const List = makeIcon(
  <path d="M8.5 6h12M8.5 12h12M8.5 18h12M4 6h.01M4 12h.01M4 18h.01" />
);

export const Settings = makeIcon(
  <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.12-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.12 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
  </>
);

export const LogOut = makeIcon(
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
);



export const Search = makeIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.5-4.5" />
  </>
);

export const Message = makeIcon(
  <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.9 8.9 0 0 1-3.7-.8L3 20l1-5.5a8 8 0 0 1-1-3.9A8.4 8.4 0 0 1 11.5 3 8.4 8.4 0 0 1 21 11.5z" />
);

export const Upload = makeIcon(
  <path d="M12 16V4M6.5 9.5L12 4l5.5 5.5M4 20h16" />
);

export const LifeBuoy = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M5.7 5.7l3.8 3.8M14.5 14.5l3.8 3.8M18.3 5.7l-3.8 3.8M9.5 14.5l-3.8 3.8" />
  </>
);