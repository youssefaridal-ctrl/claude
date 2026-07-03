import React, { useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import type { View as RNView } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { theme } from '../theme/colors';

interface Props {
  onChange: (widthCm: number, lengthCm: number) => void;
}

const CANVAS_SIZE = 300;
const GRID_CELLS = 12;
const CELL_PX = CANVAS_SIZE / GRID_CELLS;
const SCALE_OPTIONS = [20, 30, 40];

export default function SketchPad({ onChange }: Props) {
  const [cmPerCell, setCmPerCell] = useState(30);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [current, setCurrent] = useState<{ x: number; y: number } | null>(null);
  const cmPerCellRef = useRef(cmPerCell);
  cmPerCellRef.current = cmPerCell;
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const currentRef = useRef<{ x: number; y: number } | null>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const canvasWrapRef = useRef<RNView>(null);

  const clampToGrid = (val: number) => {
    const cell = Math.round(val / CELL_PX);
    return Math.min(Math.max(cell, 0), GRID_CELLS) * CELL_PX;
  };

  const emit = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const cols = Math.max(1, Math.round(Math.abs(a.x - b.x) / CELL_PX));
    const rows = Math.max(1, Math.round(Math.abs(a.y - b.y) / CELL_PX));
    onChange(cols * cmPerCellRef.current, rows * cmPerCellRef.current);
  };

  const pointFromEvent = (e: GestureResponderEvent) => {
    const { locationX, locationY, pageX, pageY } = e.nativeEvent as any;
    if (typeof locationX === 'number' && !Number.isNaN(locationX)) {
      return { x: clampToGrid(locationX), y: clampToGrid(locationY) };
    }
    const origin = originRef.current ?? { x: 0, y: 0 };
    return { x: clampToGrid(pageX - origin.x), y: clampToGrid(pageY - origin.y) };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        const p = pointFromEvent(e);
        startRef.current = p;
        currentRef.current = p;
        setStart(p);
        setCurrent(p);
      },
      onPanResponderMove: (e: GestureResponderEvent) => {
        const p = pointFromEvent(e);
        currentRef.current = p;
        setCurrent(p);
      },
      onPanResponderRelease: () => {
        const s = startRef.current;
        const c = currentRef.current;
        if (s && c && (s.x !== c.x || s.y !== c.y)) {
          emit(s, c);
        }
      },
    })
  ).current;

  const rect = useMemo(() => {
    if (!start || !current) return null;
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(current.x - start.x);
    const h = Math.abs(current.y - start.y);
    return { x, y, w, h };
  }, [start, current]);

  const gridLines = [];
  for (let i = 0; i <= GRID_CELLS; i++) {
    const pos = i * CELL_PX;
    gridLines.push(
      <Line key={`v${i}`} x1={pos} y1={0} x2={pos} y2={CANVAS_SIZE} stroke={theme.border} strokeWidth={1} />
    );
    gridLines.push(
      <Line key={`h${i}`} x1={0} y1={pos} x2={CANVAS_SIZE} y2={pos} stroke={theme.border} strokeWidth={1} />
    );
  }

  return (
    <View>
      <View style={styles.scaleRow}>
        <Text style={styles.scaleLabel}>مقياس كل مربع:</Text>
        <View style={styles.scaleOptions}>
          {SCALE_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => setCmPerCell(opt)}
              style={[styles.scaleChip, cmPerCell === opt && styles.scaleChipActive]}
            >
              <Text style={[styles.scaleChipText, cmPerCell === opt && styles.scaleChipTextActive]}>
                {opt} سم
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View
        ref={canvasWrapRef}
        style={styles.canvasWrap}
        onLayout={() => {
          canvasWrapRef.current?.measure?.(
            (_x: number, _y: number, _w: number, _h: number, pageX: number, pageY: number) => {
              originRef.current = { x: pageX, y: pageY };
            }
          );
        }}
        {...panResponder.panHandlers}
      >
        <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
          {gridLines}
          {rect && (
            <Rect
              x={rect.x}
              y={rect.y}
              width={rect.w}
              height={rect.h}
              fill={theme.primary + '33'}
              stroke={theme.primary}
              strokeWidth={2}
            />
          )}
          {rect && rect.w > 0 && (
            <SvgText
              x={rect.x + rect.w / 2}
              y={Math.max(rect.y - 8, 14)}
              fill={theme.text}
              fontSize={13}
              textAnchor="middle"
            >
              {Math.round((rect.w / CELL_PX) * cmPerCell)} سم
            </SvgText>
          )}
          {rect && rect.h > 0 && (
            <SvgText
              x={Math.min(rect.x + rect.w + 6, CANVAS_SIZE - 4)}
              y={rect.y + rect.h / 2}
              fill={theme.text}
              fontSize={13}
              textAnchor="start"
            >
              {Math.round((rect.h / CELL_PX) * cmPerCell)} سم
            </SvgText>
          )}
        </Svg>
        {!rect && (
          <View style={styles.hintOverlay} pointerEvents="none">
            <Text style={styles.hintText}>اسحب إصبعك لرسم مستطيل أرضية المطبخ</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scaleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scaleLabel: {
    color: theme.textDim,
    fontSize: 13,
  },
  scaleOptions: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  scaleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  scaleChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  scaleChipText: {
    color: theme.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  scaleChipTextActive: {
    color: '#1B1204',
  },
  canvasWrap: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    alignSelf: 'center',
    backgroundColor: theme.bgAlt,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  hintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  hintText: {
    color: theme.textDim,
    textAlign: 'center',
    fontSize: 13,
  },
});
