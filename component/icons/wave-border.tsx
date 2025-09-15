import React from 'react';

const WaveBorder = () => {
  return (
    <div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none">
        <path
          d="M20,20 
                 Q30,15 40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20 T220,20 T240,20 T260,20 T280,20
                 L280,40
                 Q285,50 280,60 T280,80 T280,100 T280,120 T280,140 T280,160 T280,180 T280,200 T280,220 T280,240 T280,260
                 L260,280
                 Q250,285 240,280 T220,280 T200,280 T180,280 T160,280 T140,280 T120,280 T100,280 T80,280 T60,280 T40,280
                 L20,280
                 Q15,275 20,260 T20,240 T20,220 T20,200 T20,180 T20,160 T20,140 T20,120 T20,100 T20,80 T20,60 T20,40 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M35,35 
                 Q45,30 55,35 T75,35 T95,35 T115,35 T135,35 T155,35 T175,35 T195,35 T215,35 T235,35 T255,35
                 L265,35
                 Q270,40 265,55 T265,75 T265,95 T265,115 T265,135 T265,155 T265,175 T265,195 T265,215 T265,235 T265,255
                 L265,265
                 Q260,270 245,265 T225,265 T205,265 T185,265 T165,265 T145,265 T125,265 T105,265 T85,265 T65,265 T45,265
                 L35,265
                 Q30,260 35,245 T35,225 T35,205 T35,185 T35,165 T35,145 T35,125 T35,105 T35,85 T35,65 T35,45 Z"
          stroke="white"
          strokeWidth="1"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default WaveBorder;
