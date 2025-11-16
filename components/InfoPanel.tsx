import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoPanelProps {
  totals: { groups: number; people: number } | null;
  limits: {
    today_people_limit: number | null;
    today_people_remaining: number | null;
    weekly: Record<string, number>;
  } | null;
  lastUpdateTime: number | null;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ totals, limits, lastUpdateTime }) => {
  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return '尚未更新';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-TW');
  };

  const todayLimit = limits?.today_people_limit;
  const remaining = limits?.today_people_remaining;
  const usedToday = todayLimit && remaining !== null
    ? todayLimit - remaining
    : null;

  const progress = todayLimit && usedToday !== null
    ? (usedToday / todayLimit) * 100
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>系統資訊</Text>
      
      {/* 第一排 */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>最後更新:</Text>
          <Text style={styles.value}>{formatTime(lastUpdateTime)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>候位組數:</Text>
          <Text style={styles.value}>{totals?.groups || 0}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>等待中人數:</Text>
          <Text style={styles.value}>{totals?.people || 0}</Text>
        </View>
      </View>
      
      {todayLimit !== null && (
        <>
          {/* 第二排 */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>今日上限:</Text>
              <Text style={styles.value}>{todayLimit} 人</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>今日已累計:</Text>
              <Text style={styles.value}>{usedToday !== null ? `${usedToday} 人` : '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>剩餘名額:</Text>
              <Text style={styles.value}>{remaining !== null ? `${remaining} 人` : '—'}</Text>
            </View>
          </View>
          
          {/* 進度條單獨一列 */}
          <View style={styles.progressContainer}>
            <Text style={styles.label}>今日進度:</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
              <Text style={styles.progressText}>
                {usedToday !== null && todayLimit ? `${usedToday}/${todayLimit}` : '0/0'}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#eeebe1',
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#76867b',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressContainer: {
    marginTop: 4,
    paddingTop: 6,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#76867b',
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2d4c41',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

