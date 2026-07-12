import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface SimpleLineChartProps {
  width: number;
  height: number;
  data: number[];
  color?: string;
  showGrid?: boolean;
}

export function SimpleLineChart({ width, height, data, color = '#2563eb', showGrid = true }: SimpleLineChartProps) {
  const values = data.length ? data : [0];
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const padding = 16;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = values.map((value, index) => {
    const x = padding + (chartWidth * index) / Math.max(values.length - 1, 1);
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  const path = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', borderRadius: 16, overflow: 'hidden' }}>
          <rect x="0" y="0" width={width} height={height} rx="16" ry="16" fill="#ffffff" />
          {showGrid && (
            <>
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth="1" />
              <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="#e5e7eb" strokeWidth="1" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
            </>
          )}
          <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="4" fill={color} />
          ))}
        </svg>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Rect x="0" y="0" width={width} height={height} fill="#ffffff" rx="16" ry="16" />
        {showGrid && (
          <>
            <Line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth={1} />
            <Line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="#e5e7eb" strokeWidth={1} />
            <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={1} />
          </>
        )}
        <Path d={path} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r={4} fill={color} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
