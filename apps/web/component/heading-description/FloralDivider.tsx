import React from 'react';

const FloralDivider = (): React.JSX.Element => (
  <svg
    viewBox="0 0 360 48"
    className="h-12 w-[26rem] max-w-full sm:w-[32rem]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1 24H84M276 24H359"
      stroke="var(--green-5)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M102 31C126 30 146 18 165 8M119 29C115 21 117 15 126 11C131 20 129 26 119 29ZM136 24C132 16 135 9 145 6C149 15 146 21 136 24ZM153 16C151 10 154 5 163 3C166 10 162 14 153 16ZM126 27C132 34 140 36 148 31C141 24 133 23 126 27ZM145 20C151 27 159 28 167 23C160 16 152 16 145 20Z"
      fill="var(--green-5)"
    />
    <path
      d="M258 31C234 30 214 18 195 8M241 29C245 21 243 15 234 11C229 20 231 26 241 29ZM224 24C228 16 225 9 215 6C211 15 214 21 224 24ZM207 16C209 10 206 5 197 3C194 10 198 14 207 16ZM234 27C228 34 220 36 212 31C219 24 227 23 234 27ZM215 20C209 27 201 28 193 23C200 16 208 16 215 20Z"
      fill="var(--green-5)"
    />
    <g transform="translate(180 21)">
      <ellipse
        rx="5"
        ry="10"
        transform="translate(0 -7)"
        fill="var(--pink-9)"
      />
      <ellipse
        rx="5"
        ry="10"
        transform="rotate(72) translate(0 -7)"
        fill="var(--pink-9)"
      />
      <ellipse
        rx="5"
        ry="10"
        transform="rotate(144) translate(0 -7)"
        fill="var(--pink-9)"
      />
      <ellipse
        rx="5"
        ry="10"
        transform="rotate(216) translate(0 -7)"
        fill="var(--pink-9)"
      />
      <ellipse
        rx="5"
        ry="10"
        transform="rotate(288) translate(0 -7)"
        fill="var(--pink-9)"
      />
      <circle r="3" fill="var(--green-5)" />
    </g>
  </svg>
);

export default FloralDivider;
