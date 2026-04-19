import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Loader2, PieChart } from 'lucide-react';

export default function FeatureImportance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/metrics`);
        setMetrics(response.data);
      } catch (err) {
        // Suppress error for mock UI purposes, handle globally if needed
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Sort metrics descending
  const sortedData = metrics?.featureImportance?.sort((a, b) => b.value - a.value) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <PieChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-slate-900">Feature Importance Analysis</h1>
      </div>
      
      <div className="glass-panel p-8 mb-8">
        <p className="text-slate-700 text-lg leading-relaxed border-l-4 border-primary pl-4 bg-slate-50 py-3 rounded-r-xl">
          <strong className="text-slate-900">Dams Quality</strong> and <strong className="text-slate-900">Drainage Systems</strong> significantly influence flood occurrence prediction, acting as the primary barriers between environmental phenomena and structural disaster.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-10 mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-8">Relative Influence of Variables</h3>
        
        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={600}>
              <BarChart layout="vertical" data={sortedData} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#334155', fontWeight: 500}} axisLine={false} tickLine={false} width={140} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px #00000010'}} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={25}>
                  {
                    sortedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 2 ? '#0f766e' : index < 5 ? '#0284c7' : '#94a3b8'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Dimensionality Reduction Module */}
      <div className="glass-panel p-6 sm:p-10 mb-10 border-t-4 border-t-accent">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Dimensionality Reduction Experiment</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Reducing predictive variables (e.g., using only the Top 10 Features vs All 20 Features) explicitly decreases prediction accuracy because flood forecasting intrinsically depends on multiple interconnected environmental and infrastructural variables working in tandem. Dimensionality reduction strips critical context essential to Xen-trees.
        </p>
        
        {loading ? null : (
          <div className="h-72 w-full md:w-3/4 lg:w-1/2 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.dimensionalityReduction || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="featureSet" tick={{fill: '#64748b', fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="accuracy" name="Model Accuracy %" radius={[6, 6, 0, 0]} barSize={80}>
                  {metrics?.dimensionalityReduction?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0f766e' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
