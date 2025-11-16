import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QueueItem } from '../services/api';

interface QueueListProps {
  queue: QueueItem[];
  onItemPress?: (item: QueueItem) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'waiting':
      return '#2d4c41';
    case 'called':
      return '#FFB870';
    case 'done':
      return '#76867b';
    case 'cancelled':
      return '#76867b';
    default:
      return '#76867b';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'waiting':
      return '等待中';
    case 'called':
      return '已叫號';
    case 'done':
      return '已完成';
    case 'cancelled':
      return '已取消';
    default:
      return status;
  }
};

const QueueItemCard: React.FC<{ item: QueueItem; onPress?: () => void }> = ({
  item,
  onPress,
}) => {
  const statusColor = getStatusColor(item.status);
  const statusText = getStatusText(item.status);

  const isDone = item.status === 'done';
  
  return (
    <TouchableOpacity
      style={[styles.card, item.status === 'called' && styles.calledCard, isDone && styles.doneCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.cardId, isDone && styles.doneText]}>{item.id}</Text>
        <Text style={[styles.cardName, isDone && styles.doneText]}>{item.name}</Text>
        <Text style={[styles.cardSize, isDone && styles.doneText]}>{item.party_size} 人</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const QueueList: React.FC<QueueListProps> = ({ queue, onItemPress }) => {
  if (queue.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📋</Text>
        <Text style={styles.emptyMessage}>點擊「刷新候位清單」來載入資料</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {queue.map((item) => (
        <QueueItemCard
          key={item.id}
          item={item}
          onPress={() => onItemPress?.(item)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  calledCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFB870',
  },
  doneCard: {
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardId: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
  },
  cardName: {
    fontSize: 17,
    color: '#333',
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  cardSize: {
    fontSize: 16,
    color: '#666',
    minWidth: 45,
    textAlign: 'right',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  doneText: {
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 51,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 19,
    color: '#666',
    textAlign: 'center',
  },
});

