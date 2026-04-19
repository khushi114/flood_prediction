import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Database, TrendingUp, AlertTriangle, ShieldCheck, Star, Zap } from 'lucide-react';

export default function Research() {
  const [imbalanceData, setImbalanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/metrics`)
      .then(res => res.json())
      .then(data => {
        setImbalanceData(data.imbalanceData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-xl font-medium text-slate-500 animate-pulse">Loading Research Data...</div>
      </div>
    );
  }

  const smoteData = [
    { class: 'Non-Flood', 'Before Resampling': 8500, 'After SMOTETomek': 8500, 'After SMOTEENN': 8500 },
    { class: 'Flood', 'Before Resampling': 1500, 'After SMOTETomek': 8500, 'After SMOTEENN': 8200 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 mb-4">
          SMOTE Research & Class Imbalance Strategies
        </h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          A fundamental challenge in environmental disaster prediction is the severe disproportion between normal environmental states and extreme flood events. Here is how we solved it — with three progressively advanced techniques.
        </p>
      </div>

      {/* Problem + Three solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Problem */}
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">1. The Research Problem</h2>
          </div>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Flood events inherently occur significantly less frequently than stable conditions. Standard machine learning algorithms become heavily biased towards the majority class (predicting "No Flood"), resulting in dangerously high False Negative rates and poor disaster readiness.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={imbalanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="class" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Before SMOTE" radius={[6, 6, 0, 0]}>
                  {imbalanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-center text-slate-500 font-medium mt-4">Fig 1: Original Imbalanced Dataset Distribution</p>
        </div>

        {/* SMOTETomek Solution */}
        <div className="glass-panel p-8 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">2. Baseline: SMOTETomek</h2>
          </div>
          <p className="text-slate-600 mb-8 leading-relaxed">
            <strong>SMOTETomek</strong> synthesizes new minority instances (SMOTE) while removing noisy, overlapping majority samples at boundaries (Tomek Links). Combined with a tuned <strong>0.45 threshold</strong>, this creates a balanced, high-recall model — our baseline.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={imbalanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="class" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Before SMOTE" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Before SMOTETomek" />
                <Bar dataKey="After SMOTE" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="After SMOTETomek" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-center text-slate-500 font-medium mt-4">Fig 2: Dataset Distribution Pre & Post-SMOTETomek</p>
        </div>
      </div>

      {/* SMOTEENN Enhanced Section */}
      <div className="glass-panel p-8 border-t-4 border-t-emerald-500 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Star className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">3. Enhanced: SMOTEENN + Cost-Sensitive XGBoost + Calibration + Stratified CV</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 mt-1 inline-block">Highest Recall Model</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-slate-600 leading-relaxed mb-6">
              <strong>SMOTEENN</strong> combines Synthetic Minority Oversampling with Edited Nearest Neighbors — aggressively cleaning both majority and minority class boundaries. This, paired with:
            </p>
            <ul className="space-y-3">
              {[
                ['Cost-Sensitive XGBoost', 'scale_pos_weight = Negatives ÷ Positives, so misclassifying a flood costs more'],
                ['Stratified 5-Fold CV', 'No data leakage — SMOTEENN is applied inside each training fold'],
                ['Sigmoid Calibration', 'Logistic Regression fitted on OOF probabilities for reliable risk scores'],
                ['F2-Optimized Threshold', 'Threshold tuned to maximize recall-weighted F2 score'],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">{title}: </span>
                    <span className="text-slate-600 text-sm">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Three-way Class Balance Comparison</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={smoteData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="class" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '12px' }} />
                  <Bar dataKey="Before Resampling" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="After SMOTETomek" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="After SMOTEENN" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-center text-slate-500 font-medium mt-4">Fig 3: Distribution Comparison Across Resampling Techniques</p>
          </div>
        </div>

        {/* Key result callout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Recall', value: '96.4%', color: 'bg-emerald-50 border-emerald-200 text-emerald-900', badge: 'Highest' },
            { label: 'Precision', value: '84.1%', color: 'bg-blue-50 border-blue-200 text-blue-900' },
            { label: 'ROC-AUC', value: '98.6%', color: 'bg-violet-50 border-violet-200 text-violet-900' },
            { label: 'Missed Floods', value: '172 FN', color: 'bg-amber-50 border-amber-200 text-amber-900', badge: 'Fewest' },
          ].map(({ label, value, color, badge }) => (
            <div key={label} className={`p-5 rounded-2xl border text-center ${color}`}>
              {badge && <span className="text-xs font-bold uppercase tracking-wider opacity-70">{badge}</span>}
              <p className="text-2xl font-black mt-1">{value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
