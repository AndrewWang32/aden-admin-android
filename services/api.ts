// API 配置和服務
const CONFIG = {
  EXEC_URL: 'https://script.google.com/macros/s/AKfycbxTE3GVTW3LQm0hwq1RoKdxCOq5mMzh5o4xSf6ACa6Y5uaOn_E2GrjxBPHxmYKvo1cF/exec',
  TOKEN: 'reman-admin-2025',
  TIMEOUT: 10000, // 10秒超時
};

export interface QueueItem {
  id: string;
  name: string;
  party_size: number;
  user_id?: string;
  status: 'waiting' | 'called' | 'done' | 'cancelled';
  created_at: string;
  flag_or_notified?: string;
}

export interface QueueListResponse {
  ok: boolean;
  queue: QueueItem[];
  totals?: {
    groups: number;
    people: number;
  };
  limits?: {
    today_people_limit: number | null;
    today_people_remaining: number | null;
    weekly: Record<string, number>;
  };
}

export interface ApiResponse<T = any> {
  ok: boolean;
  [key: string]: any;
}

// 請求去重機制
const pendingRequests = new Map<string, Promise<any>>();

// 帶超時的 fetch
function fetchWithTimeout(url: string, timeout: number = CONFIG.TIMEOUT): Promise<Response> {
  return Promise.race([
    fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Reman-Admin-Mobile/1.0.0',
      },
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('請求超時')), timeout)
    ),
  ]);
}

// API 調用函數（帶去重和超時）
async function apiCall<T = any>(
  action: string,
  params?: Record<string, any>
): Promise<T> {
  try {
    let url = `${CONFIG.EXEC_URL}?action=${action}&token=${CONFIG.TOKEN}`;

    // 添加參數
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
          url += `&${key}=${encodeURIComponent(String(value))}`;
        }
      });
    }

    // 生成請求唯一標識
    const requestKey = `${action}_${JSON.stringify(params || {})}`;

    // 檢查是否有相同的請求正在進行
    if (pendingRequests.has(requestKey)) {
      console.log(`使用緩存的請求: ${action}`);
      return await pendingRequests.get(requestKey)!;
    }

    console.log(`API 調用: ${action}`, params ? `參數: ${JSON.stringify(params)}` : '');

    // 創建請求 Promise
    const requestPromise = (async () => {
      try {
        const response = await fetchWithTimeout(url, CONFIG.TIMEOUT);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`API 回應: ${action}`, data);
        return data as T;
      } finally {
        // 請求完成後移除
        pendingRequests.delete(requestKey);
      }
    })();

    // 保存請求
    pendingRequests.set(requestKey, requestPromise);

    return await requestPromise;
  } catch (error) {
    console.error(`API 調用錯誤: ${action}`, error);
    throw error;
  }
}

// API 方法
export const api = {
  // 獲取候位清單
  list: (): Promise<QueueListResponse> => {
    return apiCall<QueueListResponse>('list');
  },

  // 叫下一組
  callNext: (): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('call');
  },

  // 指定號碼叫號
  callById: (id: string): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('call', { id });
  },

  // 過號
  skip: (id: string): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('skip', { id });
  },

  // 取消
  cancel: (id: string): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('cancel', { id });
  },

  // 完成
  done: (id: string): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('done', { id });
  },

  // 新增候位
  add: (name: string, size: number, userId?: string): Promise<ApiResponse> => {
    const params: Record<string, any> = { name, size };
    if (userId) {
      params.userId = userId;
    }
    return apiCall<ApiResponse>('add', params);
  },

  // 獲取上限設定
  getLimits: (): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('getLimits');
  },

  // 設定今日上限
  setTodayLimit: (weekday: number, people: number): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('setLimit', { weekday, people });
  },

  // 設定每週上限
  setLimits: (json: string): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('setLimits', { json });
  },

  // 重新排序
  reorder: (): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('reorder');
  },

  // 歸檔
  archive: (): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('archive');
  },

  // 重新排序並歸檔後獲取清單
  reorderArchiveList: (): Promise<QueueListResponse> => {
    return apiCall<QueueListResponse>('reorderArchiveList');
  },
};

