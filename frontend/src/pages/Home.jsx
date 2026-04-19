import { Link } from 'react-router-dom';
import { Waves, ArrowRight, Activity, Info } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center relative overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute top-80 -left-20 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute -bottom-20 left-1/2 w-[30rem] h-[30rem] bg-indigo-300/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-primary font-medium text-sm mb-8 shadow-sm">
          <Waves className="w-4 h-4" />
          <span>Advanced AI Prediction System</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Flood Occurrence
          </span>
          <br /> Prediction Model
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Leveraging state-of-the-art Machine Learning algorithms (XGBoost & SMOTE) to analyze environmental factors and provide real-time disaster preparedness warnings.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12">
          <Link to="/predict" className="btn-primary group w-full sm:w-auto">
            Predict Flood Risk
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard" className="btn-secondary w-full sm:w-auto">
            <Activity className="w-5 h-5 text-accent" />
            Model Results
          </Link>
          <Link to="/about" className="btn-secondary w-full sm:w-auto">
            <Info className="w-5 h-5 text-slate-500" />
            About Project
          </Link>
        </div>
      </div>
    </div>
  );
}
