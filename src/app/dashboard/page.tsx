'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';

const API_URL = '/api/results';

interface TestRecord {
  timestamp: string;
  primaryType: string;
  primaryName: string;
  primaryScore: number;
  secondaryType: string;
  secondaryName: string;
  secondaryScore: number;
  mixedLabel: string;
  lieScore: number;
  scores: Array<{ id: string; name: string; percentage: number }>;
}

const TYPE_COLORS: Record<string, string> = {
  slash: '#f59e0b',
  investor: '#10b981',
  climber: '#6366f1',
  connector: '#ec4899',
};

const TYPE_NAMES: Record<string, string> = {
  slash: '斜杠青年',
  investor: '投资小能手',
  climber: '职场卷王',
  connector: '社交调解者',
};

export default function Dashboard() {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setRecords(list);
      })
      .catch(() => setError('数据加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = records.filter((r) => r.timestamp.slice(0, 10) === today).length;

    // 类型分布
    const typeCount: Record<string, number> = { slash: 0, investor: 0, climber: 0, connector: 0 };
    records.forEach((r) => {
      if (typeCount[r.primaryType] !== undefined) typeCount[r.primaryType]++;
    });
    const distribution = Object.entries(typeCount).map(([id, count]) => ({
      name: TYPE_NAMES[id] || id,
      count,
      color: TYPE_COLORS[id] || '#999',
    }));

    // 每日趋势
    const dayMap: Record<string, number> = {};
    records.forEach((r) => {
      const day = r.timestamp.slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const dailyTrend = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // 最近记录
    const recent = [...records].reverse().slice(0, 20);

    return { total: records.length, todayCount, distribution, dailyTrend, recent };
  }, [records]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-gray-500 text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">数据大盘未就绪</h2>
          <p className="text-gray-500 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-4">
            请确保 Node.js 服务已启动
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数据大盘</h1>
            <p className="text-gray-500 text-sm mt-1">实时查看测试结果分布</p>
          </div>
          <a
            href="/"
            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            ← 返回测试
          </a>
        </div>

        {/* 概览卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">总参与人数</p>
            <p className="text-4xl font-bold text-amber-500">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">今日参与</p>
            <p className="text-4xl font-bold text-green-500">{stats.todayCount}</p>
          </div>
        </div>

        {/* 类型分布 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">类型分布</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.distribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 每日趋势 */}
        {stats.dailyTrend.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">每日趋势</h2>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 最近记录 */}
        {stats.recent.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">最近测试记录</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">时间</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">主要类型</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">次要类型</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">测谎分</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-600">
                        {new Date(r.timestamp).toLocaleString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: TYPE_COLORS[r.primaryType] || '#999' }}
                        >
                          {r.primaryName} ({r.primaryScore}%)
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-600">
                        {r.secondaryName} ({r.secondaryScore}%)
                      </td>
                      <td className="py-2 px-3 text-right text-gray-600">{r.lieScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {stats.total === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-500">暂无数据，分享测试链接让更多人参与吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
