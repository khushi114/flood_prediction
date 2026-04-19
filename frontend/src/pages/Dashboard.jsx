import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Area, Cell
} from 'recharts';
import { Loader2, Activity } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/metrics`);
        setMetrics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Loading Model Metrics...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center">
        <p className="font-bold text-lg mb-2">Failed to load Dashboard</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-4 opacity-70">Make sure the Flask backend is running on :5000</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-slate-900">Model Results Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Model Performance Comparison Graph */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-slate-800">Model Performance Comparison — All 4 Techniques</h3>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-sm font-bold text-emerald-800">★ Best Recall: SMOTEENN + Calibration + CV</span>
            </div>
          </div>
          <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={metrics.modelComparison} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="model" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="precision" name="Precision %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20}>
                  {
                    metrics?.modelComparison?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.model.includes('SMOTEENN') ? '#059669' : entry.model.includes('SMOTETomek') ? '#0f766e' : '#3b82f6'} />
                    ))
                  }
                </Bar>
                <Bar dataKey="recall" name="Recall %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="f1" name="F1-Score %" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="roc_auc" name="ROC-AUC %" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Precision-Recall Curve */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Precision-Recall Curve</h3>
          <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={metrics.precisionRecall} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="recall" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1.1]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="precision" fill="#bae6fd" stroke="none" />
                <Line type="monotone" dataKey="precision" stroke="#0284c7" strokeWidth={3} dot={{r: 4, fill: '#0284c7', strokeWidth: 0}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix (Mock Heatmap using Grid) */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Confusion Matrix</h3>
          <div className="flex items-center justify-center p-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-100 p-6 rounded-xl text-center border border-emerald-200">
                  <p className="text-emerald-800 text-sm font-medium mb-1">True Negatives</p>
                  <p className="text-3xl font-bold text-emerald-900">{metrics.confusionMatrix[0][0]}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-xl text-center border border-red-100">
                  <p className="text-red-800 text-sm font-medium mb-1">False Positives</p>
                  <p className="text-3xl font-bold text-red-900">{metrics.confusionMatrix[0][1]}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-xl text-center border border-red-100">
                  <p className="text-red-800 text-sm font-medium mb-1">False Negatives</p>
                  <p className="text-3xl font-bold text-red-900">{metrics.confusionMatrix[1][0]}</p>
                </div>
                <div className="bg-emerald-100 p-6 rounded-xl text-center border border-emerald-200">
                  <p className="text-emerald-800 text-sm font-medium mb-1">True Positives</p>
                  <p className="text-3xl font-bold text-emerald-900">{metrics.confusionMatrix[1][1]}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Quick Feature Importance summary */}
        <div className="glass-panel p-6 flex flex-col justify-center">
           <h3 className="text-lg font-bold text-slate-800 mb-4">View Full Feature Importance</h3>
           <p className="text-slate-600 mb-6">
             See how the 18 parameters contribute to the model's predictions. The most heavily weighted environmental factors dictate the final risk score.
           </p>
           <a href="/features" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center font-medium transition-colors">
             View Feature Importance Chart &rarr;
           </a>
        </div>

      </div>
    </div>
  );
}
