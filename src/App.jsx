import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/* ---------- 常數 ---------- */
const MOODS = [
  { label: '很糟', value: 1, color: '#EF5350' },
  { label: '低落', value: 2, color: '#FFA726' },
  { label: '普通', value: 3, color: '#FFEE58' },
  { label: '不錯', value: 4, color: '#66BB6A' },
  { label: '很好', value: 5, color: '#42A5F5' },
];
const TODAY = new Date().toISOString().slice(0, 10);

/* ---------- 主元件 ---------- */
function App() {
  const [moodsData, setMoodsData] = useState({}); // { 'YYYY-MM-DD': {score, timestamp} }

  /* 1. 載入 localStorage */
  useEffect(() => {
    const raw = localStorage.getItem('mood_data');
    setMoodsData(raw ? JSON.parse(raw) : {});
  }, []);

  /* 2. 儲存心情 */
  const saveMood = (score) => {
    const raw = localStorage.getItem('mood_data') || '{}';
    const data = JSON.parse(raw);
    data[TODAY] = { score, timestamp: Date.now() };
    localStorage.setItem('mood_data', JSON.stringify(data));
    setMoodsData({ ...data });
    alert(`✅ 已儲存 ${score}/5 分`);
  };

  /* 3. 最近 7 天圖表 */
  const chartData = useMemo(() => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      arr.push({
        date: key,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        score: moodsData[key]?.score ?? 0,
      });
    }
    return arr;
  }, [moodsData]);

  /* ---------- UI ---------- */
  return (
    <div className="App">
      <h1>心情日記（Web 離線版）</h1>

      <div className="btnGroup">
        {MOODS.map((m) => (
          <button
            key={m.value}
            className="moodBtn"
            style={{ backgroundColor: m.color }}
            onClick={() => saveMood(m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <h2>最近 7 天趨勢</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#007AFF" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;