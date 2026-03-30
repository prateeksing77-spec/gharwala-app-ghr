interface KiraNeyLogoProps {
  size?: number;
  showTagline?: boolean;
  className?: string;
}

const KiraNeyLogo = ({ size = 80, showTagline = false, className = '' }: KiraNeyLogoProps) => {
  const scale = size / 80;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#FF6F00" />
          </linearGradient>
          <linearGradient id="houseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="40" cy="40" r="38" fill="url(#houseGrad)" opacity="0.15" />

        {/* K letter */}
        <path
          d="M22 16 L22 64 L30 64 L30 44 L48 64 L58 64 L38 42 L56 16 L46 16 L30 38 L30 16 Z"
          fill="url(#kGrad)"
        />

        {/* House roof on top-right of K */}
        <path
          d="M44 12 L54 20 L64 12 L44 12Z"
          fill="url(#houseGrad)"
        />
        <rect x="48" y="12" width="12" height="10" rx="1" fill="url(#houseGrad)" />
        {/* Door */}
        <rect x="52" y="16" width="4" height="6" rx="0.5" fill="#FF6F00" />

        {/* Shopping bag hanging from K arm */}
        <rect x="50" y="38" width="10" height="12" rx="2" fill="#FF6F00" opacity="0.9" />
        <path
          d="M52 38 L52 35 C52 33 54 31 55 31 C56 31 58 33 58 35 L58 38"
          stroke="#FF8F00"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {showTagline && (
        <p className="text-muted-foreground text-sm font-light tracking-wide">
          Ghar baithe kirana
        </p>
      )}
    </div>
  );
};

export default KiraNeyLogo;
