"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface RadarChartProps {
    data: Record<string, number>;
    onPointClick: (subject: string) => void;
    onDefinitionsClick: () => void;
}

const RadarChartCustom: React.FC<RadarChartProps> = ({ data, onPointClick, onDefinitionsClick }) => {
    
    const size = 600;
    const center = size / 2;
    const maxRadius = 180; 

    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; score: number; description: string } | null>(null);

    
    const getRadius = (score: number) => {
        return (1 - (score / 10)) * maxRadius;
    };

    const keys = Object.keys(data);
    const totalPoints = keys.length;

    const categories = keys.map((key, i) => {
        const angle = (360 / totalPoints) * i - 90;
        return {
            name: key,
            label: key.toUpperCase(),
            angle: angle
        };
    });

    const getPointPosition = (score: number, angleDeg: number) => {
        const radius = getRadius(score);
        const angleRad = (angleDeg * Math.PI) / 180;
        return {
            x: center + radius * Math.cos(angleRad),
            y: center + radius * Math.sin(angleRad),
        };
    };

    
    const wrapText = (text: string, maxChar: number = 20) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length < maxChar) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    };

    return (
        <div className="w-full h-[650px] bg-[#F1F1F1] rounded-3xl p-4 border border-slate-200 relative shadow-lg flex flex-col items-center justify-center">

            <h3 className="absolute top-6 left-8 text-slate-900 font-black tracking-widest uppercase text-sm z-20">Visual Match Radar</h3>

            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="relative z-10" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {}
                {}
                <circle cx={center} cy={center} r={maxRadius} fill="#DB4437" fillOpacity="0.1" stroke="#DB4437" strokeWidth="0.5" />

                {}
                <circle cx={center} cy={center} r={getRadius(3.5)} fill="#F4B400" fillOpacity="0.15" stroke="#F4B400" strokeWidth="0.5" />

                {}
                <circle cx={center} cy={center} r={getRadius(6.5)} fill="#4285F4" fillOpacity="0.2" stroke="#4285F4" strokeWidth="0.5" />

                {}
                <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="#78909C" strokeWidth="2" strokeDasharray="6 4" />
                <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="#78909C" strokeWidth="2" strokeDasharray="6 4" />

                {}

                {}
                <circle cx={center} cy={center} r={maxRadius * 0.75} fill="none" stroke="#B0BEC5" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <circle cx={center} cy={center} r={maxRadius * 0.5} fill="none" stroke="#B0BEC5" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <circle cx={center} cy={center} r={maxRadius * 0.25} fill="none" stroke="#B0BEC5" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                {}
                {categories.map((cat, i) => {
                    const score = data[cat.name];
                    const pos = getPointPosition(score, cat.angle);

                    return (
                        <g
                            key={i}
                            cursor="pointer"
                            onClick={() => onPointClick(cat.name)}
                            onMouseEnter={() => setHoveredPoint({
                                x: pos.x,
                                y: pos.y,
                                label: cat.name,
                                score,
                                description: score > 7 ? "Strong match" : score > 4 ? "Moderate match" : "Needs improvement"
                            })}
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            <motion.circle
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                cx={pos.x}
                                cy={pos.y}
                                r="6"
                                className="fill-blue-600 stroke-white"
                                strokeWidth="2"
                            />
                        </g>
                    );
                })}

                {}
                {categories.map((cat, i) => {
                    const angleRad = (cat.angle * Math.PI) / 180;
                    const labelRadius = maxRadius + 55; 
                    const lx = center + labelRadius * Math.cos(angleRad);
                    const ly = center + labelRadius * Math.sin(angleRad);

                    let textAnchor = "middle";
                    if (cat.angle === 0 || cat.angle === 180 || cat.angle === -180) textAnchor = "middle";
                    else if (cat.angle > -90 && cat.angle < 90) textAnchor = "start";
                    else textAnchor = "end";

                    if (i === 0) textAnchor = "middle";

                    const lines = wrapText(cat.label, 18);

                    return (
                        <text
                            key={i}
                            x={lx}
                            y={ly}
                            textAnchor={textAnchor as any}
                            className="fill-slate-900 font-extrabold tracking-wide drop-shadow-sm"
                            style={{ fontSize: '12px' }}
                        >
                            {lines.map((line, lineIdx) => (
                                <tspan key={lineIdx} x={lx} dy={lineIdx === 0 ? 0 : "1.2em"}>
                                    {line}
                                </tspan>
                            ))}
                        </text>
                    );
                })}
            </svg>

            {}
            <AnimatePresence>
                {hoveredPoint && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none"
                        style={{
                            left: hoveredPoint.x,
                            top: hoveredPoint.y,
                            transform: `translate(${hoveredPoint.x > size / 2 ? '-100%' : '0%'}, ${hoveredPoint.y < 150 ? '20px' : '-130%'})`,
                            marginLeft: hoveredPoint.x > size / 2 ? '-20px' : '20px',
                            minWidth: '200px'
                        }}
                    >
                        <h4 className="font-bold text-base mb-1 capitalize text-blue-400">{hoveredPoint.label}</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl font-black">{hoveredPoint.score}</span>
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">/ 10</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{hoveredPoint.description}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <div className="absolute top-6 right-8 flex flex-col gap-2 z-20 bg-white/90 p-4 rounded-2xl backdrop-blur-md border border-slate-200 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4285F4] opacity-80"></div>
                    <span className="text-xs text-slate-900 font-extrabold">Inner (High Match)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F4B400] opacity-60"></div>
                    <span className="text-xs text-slate-900 font-extrabold">Middle (Medium)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#DB4437] opacity-40"></div>
                    <span className="text-xs text-slate-900 font-extrabold">Outer (Low Match)</span>
                </div>
            </div>

            {}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
                <button
                    onClick={onDefinitionsClick}
                    className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl text-sm"
                >
                    <BookOpen className="w-4 h-4" />
                    Illustration of Dimensions
                </button>
            </div>
        </div>
    );
};

export default RadarChartCustom;
