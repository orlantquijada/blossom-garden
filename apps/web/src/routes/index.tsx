import { Link, createFileRoute } from "@tanstack/react-router";

const GOLD = "#e6a42b";

function Rose({
  x,
  y,
  r,
}: {
  readonly x: number;
  readonly y: number;
  readonly r: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle fill={GOLD} r={r} />
      <path
        d={`M0 ${-r * 0.55} a${r * 0.55} ${r * 0.55} 0 1 1 ${-r * 0.55} ${r * 0.55} a${r * 0.3} ${r * 0.3} 0 1 0 ${r * 0.3} ${-r * 0.3}`}
        fill="none"
        stroke="#060504"
        strokeWidth={r * 0.16}
      />
    </g>
  );
}

function Flower({
  x,
  y,
  r,
}: {
  readonly x: number;
  readonly y: number;
  readonly r: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          cy={-r * 0.6}
          fill={GOLD}
          key={deg}
          rx={r * 0.34}
          ry={r * 0.62}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle fill="#060504" r={r * 0.22} />
    </g>
  );
}

function Leaf({
  x,
  y,
  rot,
}: {
  readonly x: number;
  readonly y: number;
  readonly rot: number;
}) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx="4"
      ry="9"
      stroke={GOLD}
      strokeWidth="1.2"
      transform={`rotate(${rot} ${x} ${y})`}
    />
  );
}

function RoseSpray() {
  return (
    <svg
      aria-hidden="true"
      className="h-20 w-72 sm:h-24 sm:w-96"
      fill="none"
      viewBox="0 0 280 70"
    >
      <path
        d="M140 40 C 105 32, 70 40, 28 26"
        stroke={GOLD}
        strokeWidth="1.2"
      />
      <path
        d="M140 40 C 175 32, 210 40, 252 26"
        stroke={GOLD}
        strokeWidth="1.2"
      />
      <Leaf rot={-40} x={52} y={30} />
      <Leaf rot={-25} x={82} y={33} />
      <Leaf rot={-10} x={110} y={36} />
      <Leaf rot={40} x={228} y={30} />
      <Leaf rot={25} x={198} y={33} />
      <Leaf rot={10} x={170} y={36} />
      <Flower r={11} x={34} y={22} />
      <Flower r={9} x={246} y={22} />
      <Rose r={13} x={124} y={26} />
      <Rose r={16} x={148} y={20} />
      <Rose r={11} x={138} y={44} />
      <Rose r={12} x={162} y={40} />
    </svg>
  );
}

function ArchedTitle() {
  return (
    <svg
      aria-label="Blossom Garden"
      className="w-full max-w-2xl overflow-visible"
      viewBox="0 0 560 120"
    >
      <title>Blossom Garden</title>
      <path d="M 10 108 Q 280 22 550 108" fill="none" id="title-arc" />
      <text
        fill={GOLD}
        fontFamily="Fraunces, Georgia, serif"
        fontSize="42"
        fontWeight="600"
        letterSpacing="3"
      >
        <textPath href="#title-arc" startOffset="50%" textAnchor="middle">
          BLOSSOM GARDEN
        </textPath>
      </text>
    </svg>
  );
}

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#060504] px-6 py-10 text-center text-[#ede5d4]">
      <RoseSpray />

      <ArchedTitle />

      <p className="font-fraunces mt-1 text-lg tracking-[0.45em] text-[#e6a42b] sm:text-xl">
        CAFE &amp; BAR
      </p>

      <div className="mt-5 flex items-center gap-3 text-[#e6a42b]">
        <span className="h-px w-10 bg-[#e6a42b]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#e6a42b]" />
        <span className="h-px w-10 bg-[#e6a42b]" />
      </div>

      <p className="mt-5 text-sm tracking-[0.15em] text-[#e6a42b]/80">
        ブロッサムガーデン &middot; カフェ &amp; バー
      </p>

      <p className="mt-7 max-w-md text-base leading-relaxed text-[#ede5d4]/75">
        Scan a QR to join, receive your personal member code, and let our staff
        recognize your VIP status and visit history the moment you walk in.
      </p>

      <div className="mt-11">
        <Link
          className="font-fraunces rounded-md bg-[#e6a42b] px-9 py-3 text-base tracking-wide text-[#060504] transition-opacity hover:opacity-85"
          to="/signup"
        >
          Join the Membership
        </Link>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  // html/body stay themed for admin; overscroll behind landing must match its black
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
