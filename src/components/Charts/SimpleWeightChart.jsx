// src/components/Charts/SimpleWeightChart.jsx
import React, { useMemo } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer
} from 'recharts';
import { format, parseISO } from "date-fns";

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div style={{ background: 'transparent', color: 'var(--primary-color)', fontSize: 14 }}>
				{payload[0].value} кг
			</div>
		);
	}
	return null;
};

const SimpleWeightChart = ({ data = [] }) => {
	const { yMin, yMax } = useMemo(() => {
		if (data.length === 0) return { yMin: 0, yMax: 100 };
		const weights = data.map(entry => entry.weight);
		const minWeight = Math.min(...weights);
		const maxWeight = Math.max(...weights);
		const padding = Math.max(2, (maxWeight - minWeight) * 0.2);
		return {
			yMin: Math.floor(minWeight - padding),
			yMax: Math.ceil(maxWeight + padding)
		};
	}, [data]);

	return (
		<ResponsiveContainer height={320}>
			<LineChart
				data={data}
				margin={{ top: 10, right: 20, left: -30, bottom: 30 }}
			>
				<CartesianGrid stroke="#444" strokeDasharray="3 3" />
				<XAxis
					dataKey="date"
					tick={{ fill: '#ccc', fontSize: 14 }}
					tickFormatter={(str) => {
						try {
							return format(parseISO(str), "dd.MM");
						} catch {
							return str;
						}
					}}
				/>
				<YAxis domain={[yMin, yMax]} tick={{ fill: '#ccc', fontSize: 14 }} />
				<Tooltip content={<CustomTooltip />} />
				<Line
					type="monotone"
					dataKey="weight"
					stroke="var(--primary-color)"
					strokeWidth={2}
					dot={{ r: 4 }}
					activeDot={{ r: 6 }}
					isAnimationActive={true}
					animationDuration={800}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default SimpleWeightChart;
