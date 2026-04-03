'use client';

import { useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

// 数据上报地址 — 与前端同源（同域）
const REPORT_URL = '/api/report';

interface ResultProps {
  results: Array<{
    id: string;
    name: string;
    description: string;
    careers: string[];
    color: string;
    percentage: number;
    profile: string;
    strengths: string[];
    blindSpots: string[];
    actionSteps: string[];
    mindset: string;
    representative: {
      name: string;
      title: string;
      story: string;
      image: string;
    };
  }>;
  lieScore: number;
  mixedTypeLabel: string;
  mixedTypeDescription: string;
  onRestart: () => void;
}

export default function Result({ results, lieScore, mixedTypeLabel, mixedTypeDescription, onRestart }: ResultProps) {
  const topType = results[0];
  const secondaryType = results[1];
  const chartData = results.map((r) => ({
    subject: r.name,
    score: r.percentage,
  }));

  // 上报测试结果到 Google Sheets
  useEffect(() => {
    if (!REPORT_URL) return;
    const payload = {
      timestamp: new Date().toISOString(),
      primaryType: topType.id,
      primaryName: topType.name,
      primaryScore: topType.percentage,
      secondaryType: secondaryType.id,
      secondaryName: secondaryType.name,
      secondaryScore: secondaryType.percentage,
      mixedLabel: mixedTypeLabel,
      lieScore,
      scores: results.map((r) => ({ id: r.id, name: r.name, percentage: r.percentage })),
    };
    fetch(REPORT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-6 text-center">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">测试结果</h1>
          <p className="text-gray-500 mb-6">你的天生来财方式如下</p>

          <div
            className="rounded-xl p-6 text-white mb-6"
            style={{ background: `linear-gradient(135deg, ${topType.color}, ${topType.color}dd)` }}
          >
            <p className="text-sm opacity-80 mb-1">你的来财方式</p>
            <p className="text-2xl font-bold mb-2">{topType.name}</p>
            <p className="text-sm opacity-90">{topType.description}</p>
          </div>

          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">适合的发展方向</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {topType.careers.map((career) => (
                <span
                  key={career}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: topType.color + '20', color: topType.color }}
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 测谎提示 */}
        {lieScore >= 60 && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-orange-700 mb-2 flex items-center gap-2">
              <span className="text-2xl">🔍</span> 诚实度提醒
            </h3>
            <p className="text-orange-600 text-sm leading-relaxed">
              你的回答中有 <strong>{lieScore}%</strong> 的倾向选择了极端正面的描述。这可能意味着你在一定程度上美化了自己。
              测试结果仅供参考，真实的自我认知比完美的答案更有价值。
            </p>
          </div>
        )}

        {/* 混合类型解读 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🧬</span> 你的类型组合
          </h2>
          <div
            className="rounded-xl p-5 text-white mb-4"
            style={{ background: `linear-gradient(135deg, ${results[0].color}, ${results[1].color})` }}
          >
            <p className="text-sm opacity-80 mb-1">你的来财类型</p>
            <p className="text-xl font-bold">{mixedTypeLabel}</p>
          </div>
          <p className="text-gray-700 leading-relaxed">{mixedTypeDescription}</p>
        </div>

        {/* 详细解读 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span> 详细解读
          </h2>
          <p className="text-gray-700 leading-relaxed">{topType.profile}</p>
        </div>

        {/* 代表人物 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span> 你的类型代表人物
          </h2>
          <div className="flex items-start gap-6 mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor: topType.color + '20' }}
            >
              {topType.representative.image}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{topType.representative.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{topType.representative.title}</p>
            </div>
          </div>
          <div
            className="rounded-xl p-5 leading-relaxed text-gray-700"
            style={{ backgroundColor: topType.color + '08', borderLeft: `4px solid ${topType.color}` }}
          >
            {topType.representative.story}
          </div>
        </div>

        {/* 核心优势 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💪</span> 核心优势
          </h2>
          <div className="space-y-3">
            {topType.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                  style={{ backgroundColor: topType.color }}
                >
                  ✓
                </span>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 需要注意 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> 需要注意的盲点
          </h2>
          <div className="space-y-3">
            {topType.blindSpots.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 bg-orange-400">
                  !
                </span>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 行动建议 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚀</span> 下一步行动建议
          </h2>
          <div className="space-y-4">
            {topType.actionSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: topType.color }}
                >
                  {i + 1}
                </span>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 心态寄语 */}
        <div
          className="rounded-2xl shadow-xl p-8 mb-6 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${topType.color}, ${topType.color}bb)` }}
        >
          <p className="text-sm opacity-80 mb-2">💡 心态寄语</p>
          <p className="text-lg font-medium leading-relaxed">{topType.mindset}</p>
        </div>

        {/* 雷达图 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">四维能力雷达图</h2>
          <div className="w-full h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="得分"
                  dataKey="score"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 各维度得分 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">各维度详细得分</h2>
          <div className="space-y-4">
            {results.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 w-6">{i + 1}</span>
                <span className="text-sm font-medium text-gray-700 w-24">{r.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{ width: `${r.percentage}%`, backgroundColor: r.color }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-12 text-right">{r.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 重新测试 */}
        <div className="text-center pb-8">
          <button
            onClick={onRestart}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  );
}
