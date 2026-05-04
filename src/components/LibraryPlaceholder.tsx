export default function LibraryPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 ${className}`}>
      <svg
        viewBox="0 0 160 100"
        className="w-3/5 h-3/5 opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8"  y="80" width="144" height="6" rx="2" fill="#a0845c" />
        <rect x="14" y="44" width="14" height="36" rx="1.5" fill="#8b6f47" />
        <rect x="30" y="52" width="11" height="28" rx="1.5" fill="#6b8e6e" />
        <rect x="43" y="38" width="16" height="42" rx="1.5" fill="#9c7b5a" />
        <rect x="61" y="48" width="12" height="32" rx="1.5" fill="#7a8fa6" />
        <rect x="75" y="40" width="15" height="40" rx="1.5" fill="#b8976a" />
        <rect x="92" y="55" width="10" height="25" rx="1.5" fill="#8fa67a" />
        <rect x="104" y="42" width="18" height="38" rx="1.5" fill="#a68b5b" />
        <rect x="124" y="50" width="12" height="30" rx="1.5" fill="#7a6e5a" />
        <rect x="138" y="44" width="14" height="36" rx="1.5" fill="#8b6f47" />
        <rect x="8"  y="36" width="144" height="5" rx="2" fill="#a0845c" />
        <rect x="16" y="12" width="12" height="24" rx="1.5" fill="#9c7b5a" />
        <rect x="30" y="18" width="10" height="18" rx="1.5" fill="#7a8fa6" />
        <rect x="42" y="8"  width="15" height="28" rx="1.5" fill="#8b6f47" />
        <rect x="59" y="14" width="11" height="22" rx="1.5" fill="#6b8e6e" />
        <rect x="72" y="6"  width="17" height="30" rx="1.5" fill="#b8976a" />
        <rect x="91" y="16" width="10" height="20" rx="1.5" fill="#a68b5b" />
        <rect x="103" y="10" width="14" height="26" rx="1.5" fill="#8fa67a" />
        <rect x="119" y="15" width="11" height="21" rx="1.5" fill="#9c7b5a" />
        <rect x="132" y="9"  width="13" height="27" rx="1.5" fill="#7a8fa6" />
      </svg>
    </div>
  );
}
