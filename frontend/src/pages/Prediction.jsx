import { useState } from 'react';
import axios from 'axios';
import { Info, AlertTriangle, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const featuresList = [
  { id: 'monsoonIntensity', label: 'Monsoon Intensity', desc: 'Intensity of seasonal rainfall (0-10 or 0-100 scale usually)' },
  { id: 'topographyDrainage', label: 'Topography Drainage', desc: 'Natural drainage capability of the land' },
  { id: 'riverManagement', label: 'River Management', desc: 'Effectiveness of local river flow control systems' },
  { id: 'deforestation', label: 'Deforestation', desc: 'Level of forest clearing in the area' },
  { id: 'urbanization', label: 'Urbanization', desc: 'Density and spread of urban infrastructure' },
  { id: 'climateChange', label: 'Climate Change', desc: 'Local metric for climate change impact' },
  { id: 'damsQuality', label: 'Dams Quality', desc: 'Structural integrity of nearby dams' },
  { id: 'siltation', label: 'Siltation', desc: 'Accumulation of silt in water bodies' },
  { id: 'agriculturalPractices', label: 'Agricultural Practices', desc: 'Impact of farming methods on soil retention' },
  { id: 'encroachments', label: 'Encroachments', desc: 'Illegal structures near water bodies' },
  { id: 'ineffectiveDisasterPreparedness', label: 'Ineffective Disaster Preparedness', desc: 'Score representing lack of established readiness' },
  { id: 'drainageSystems', label: 'Drainage Systems', desc: 'Quality of artificial urban drainage' },
  { id: 'coastalVulnerability', label: 'Coastal Vulnerability', desc: 'Proximity and susceptibility to coastal surges' },
  { id: 'landslides', label: 'Landslides', desc: 'Frequency or risk of landslides in the region' },
  { id: 'watersheds', label: 'Watersheds', desc: 'Health and capacity of local watersheds' },
  { id: 'deterioratingInfrastructure', label: 'Deteriorating Infrastructure', desc: 'Condition and state of degradation of public assets' },
  { id: 'populationScore', label: 'Population Score', desc: 'Density factor affecting risk mitigation' },
  { id: 'wetlandLoss', label: 'Wetland Loss', desc: 'Reduction in natural water-absorbing wetlands' },
  { id: 'inadequatePlanning', label: 'Inadequate Planning', desc: 'Score for poor urban layout and disaster readiness' },
  { id: 'politicalFactors', label: 'Political Factors', desc: 'Governance impact on disaster management' },
];

export default function Prediction() {
  const [formData, setFormData] = useState(
    featuresList.reduce((acc, curr) => ({ ...acc, [curr.id]: '' }), {})
  );
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Basic validation: ensure all fields are numbers
      for (const [key, value] of Object.entries(formData)) {
        if (value === '' || isNaN(value)) {
          throw new Error(`Invalid value for ${key}. Please enter a number.`);
        }
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (level) => {
    switch(level) {
      case 'High': return <AlertTriangle className="w-12 h-12 text-red-600" />;
      case 'Medium': return <AlertCircle className="w-12 h-12 text-orange-600" />;
      case 'Low': return <ShieldCheck className="w-12 h-12 text-emerald-600" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Form Section */}
      <div className="w-full lg:w-2/3 glass-panel p-6 sm:p-8">
        <div className="mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Environmental Parameters</h2>
          <p className="text-slate-500 text-sm">Fill in the 18 factors below to run the XGBoost prediction. Values should be numeric.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feature) => (
              <div key={feature.id} className="relative group">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  {feature.label}
                  <div className="relative flex items-center justify-center">
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                      {feature.desc}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  step="any"
                  name={feature.id}
                  value={formData[feature.id]}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="input-base"
                  required
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end">
             <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary hover:bg-blue-700 disabled:bg-primary/50 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Analyzing Data...' : 'Run Prediction'}
             </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      <div className="w-full lg:w-1/3 sticky top-24">
        <div className="glass-panel p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          {!result && !loading && (
            <div className="text-slate-400 flex flex-col items-center gap-4">
               <AlertCircle className="w-16 h-16 opacity-50" />
               <p className="text-sm font-medium">Awaiting Input Data...</p>
               <p className="text-xs">Submit the form to view real-time predictions.</p>
            </div>
          )}

          {loading && (
            <div className="text-primary flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 animate-spin" />
              <p className="font-semibold animate-pulse">Running SMOTE XGBoost Model...</p>
            </div>
          )}

          {result && !loading && (
            <div className="w-full animate-in fade-in zoom-in duration-500 flex flex-col items-center">
              <div className="mb-6">
                 {getRiskIcon(result.riskLevel)}
              </div>
              
              <h3 className="text-slate-500 font-semibold mb-1 uppercase tracking-widest text-sm">Prediction Outline</h3>
              <div className={cn("text-3xl font-bold mb-8 px-6 py-2 rounded-full border", getRiskColor(result.riskLevel))}>
                {result.riskLevel.toUpperCase()} RISK
              </div>

              <div className="w-full bg-slate-100 rounded-2xl p-6 relative overflow-hidden">
                <p className="text-sm text-slate-500 font-medium mb-4">Probability of Occurrence</p>
                <div className="flex items-end justify-center gap-1 mb-4 z-10 relative">
                  <span className="text-5xl font-extrabold text-slate-800">{result.probability}</span>
                  <span className="text-2xl font-bold text-slate-400 mb-1">%</span>
                </div>
                
                {/* Progress bar gauge style */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative z-10">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                      result.riskLevel === 'High' ? 'bg-red-500' : 
                      result.riskLevel === 'Medium' ? 'bg-orange-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${result.probability}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
