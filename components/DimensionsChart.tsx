
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ResearchScores } from '../types';

interface Props {
  scores: ResearchScores;
}

const DimensionsChart: React.FC<Props> = ({ scores }) => {
  const normalize = (val: number) => Math.min(100, Math.max(0, (val + 15) * 3.33));

  const data = [
    { subject: '理论', A: normalize(scores.theory), fullMark: 100 },
    { subject: '广度', A: normalize(scores.breadth), fullMark: 100 },
    { subject: '冒险', A: normalize(scores.risk), fullMark: 100 },
    { subject: '协同', A: normalize(scores.collaboration), fullMark: 100 },
    { subject: '创新', A: normalize(scores.exploration), fullMark: 100 },
    { subject: '干/湿', A: normalize(scores.labType), fullMark: 100 },
    { subject: '模型', A: normalize(scores.modelFocus), fullMark: 100 },
    { subject: '政策', A: normalize(scores.policyFocus), fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#000000', fontSize: 11, fontWeight: 500 }} />
          <Radar
            name="Persona"
            dataKey="A"
            stroke="#000000"
            fill="#000000"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DimensionsChart;
