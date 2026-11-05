const rooms = [
  [282,263,77,112,'방송'], [282,375,77,122,'준비실'],
  [359,263,384,234,'새롬홀'],
  [817,375,76,198,'직\n원\n화\n장\n실\n(남)'],
  [893,375,76,198,'직\n원\n화\n장\n실\n(여)'],
  [969,375,212,198,'창의공작실'], [1181,375,185,198,'AI연구실'],
  [1366,375,207,198,'이음실'],
  [206,574,76,116,'청소\n실무원\n휴게실'], [282,574,77,116,'재료실'],
  [206,690,153,113,'교육환경지원실'],
  [359,574,185,229,'발명교육센터'], [544,574,79,229,'발명\n교육\n연구실'],
  [623,574,120,229,'무한상상실'],
  [893,629,157,174,'교장실'], [1050,629,89,174,'Interview\nroom'],
  [1139,629,124,174,'산학협력부'], [1263,629,103,174,'취업\n지원\n센터'],
  [1366,629,281,174,'건강체력교실'], [1722,629,161,174,'밴드부실'],
  [1798,573,85,56,'승강기'],
]

function Label({ x, y, lines, size = 27, width = Infinity }) {
  const rows = lines.split('\n')
  const fontSize = Math.min(size, (width - 8) / Math.max(...rows.map((line) => [...line].reduce((length, character) => length + (/[a-zA-Z]/.test(character) ? 0.55 : 1), 0))))
  return (
    <text x={x} y={y} textAnchor="middle" fill="#30363b" stroke="none" fontSize={fontSize}>
      {rows.map((line, index) => <tspan key={index} x={x} dy={index === 0 ? -((rows.length - 1) * fontSize * 0.65) : fontSize * 1.3}>{line}</tspan>)}
    </text>
  )
}

export default function Creative1FFloorPlan() {
  return (
    <svg viewBox="130 243 1773 580" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="창의관 1층 평면도" style={{ display: 'block', background: '#fff', fontFamily: '"Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif' }}>
      <g fill="none" stroke="#383d42" strokeWidth="2.5" strokeLinejoin="miter">
        <path d="M206 263H743V375H1573V437H1759L1798 497V573H1883V803H206Z" />
        <path d="M206 497H743M206 574H743M743 574V803M855 629V803M1647 629V803" />
        <rect x="150" y="437" width="39" height="253" />
        {rooms.map(([x,y,width,height,label]) => (
          <g key={`${x}:${y}`} data-room-name={label.replaceAll('\n', '')} role="button" tabIndex={0} aria-label={label.replaceAll('\n', '')} style={{ cursor: 'pointer' }}>
            <rect x={x} y={y} width={width} height={height} fill="transparent" />
            <Label x={x + width / 2} y={y + height / 2 + 9} lines={label} width={width} size={label === '승강기' ? 22 : 27} />
          </g>
        ))}
        <path d="M206 318H282M244 318V438H282M743 375V497M780 375V497M817 375V497M1573 437V573M1609 437V573M1647 437V573M206 1179H282M243 1123V1331M206 1331H282M206 1370H282M1809 1178V1328M1883 1235H1759" strokeWidth="1.5" />
        {Array.from({ length: 11 }, (_, i) => <path key={`left-${i}`} d={`M244 ${320+i*11.8}H282 M206 ${1179+i*10.7}H282`} strokeWidth="1.3" />)}
        {Array.from({ length: 6 }, (_, i) => <path key={`upper-${i}`} d={`M743 ${378+i*12}H817 M1573 ${437+i*12}H1647 M${1809+i*14.8} 1178V1328`} strokeWidth="1.3" />)}
      </g>
      <Label x={170} y={553} lines={'창\n의\n관'} />
      <Label x={798} y={700} lines="로비" />
      <Label x={874} y={720} lines={'예\n감\n존'} />
    </svg>
  )
}
