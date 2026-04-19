import { User, Cpu, Database } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About the Research</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Handling Class Imbalance in Flood Occurrence Prediction Using Machine Learning Techniques
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Team Card */}
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Research Team</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Students</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Khushi Solanki</span>
                  <span className="text-sm bg-slate-100 px-2 py-1 rounded">23IT126</span>
                </li>
                <li className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Nyuti Bhesania</span>
                  <span className="text-sm bg-slate-100 px-2 py-1 rounded">23IT010</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Mentors</h3>
              <ul className="space-y-2">
                <li className="text-slate-700 font-medium">Dr. Purvi Prajapati</li>
                <li className="text-slate-700 font-medium">Dr. Bimal Patel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Methodology Card */}
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent/10 p-3 rounded-xl">
              <Cpu className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Methodology & Models</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              This project tackles the critical issue of <strong className="text-slate-800">imbalanced datasets</strong> in environmental hazard prediction. Typically, flood non-occurrence data heavily outweighs occurrence data, leading to biased predictions.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                SMOTE
              </h4>
              <p className="text-sm text-slate-600">
                Synthetic Minority Over-sampling Technique was applied to balance the dataset by generating synthetic examples of the minority class.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                XGBoost Engine
              </h4>
              <p className="text-sm text-slate-600">
                An advanced Gradient Boosting framework that provides high-performance, robust predictions based on the 18 selected environmental and infrastructural features.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dataset Description */}
      <div className="glass-panel p-8 text-center bg-gradient-to-br from-white to-slate-50">
        <h2 className="text-xl font-bold text-slate-800 mb-3">Dataset Description</h2>
        <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The dataset encompasses 18 distinct variables defining environmental vulnerabilities, structural resilience, and developmental patterns. Categories span from <span className="font-medium text-slate-700">Monsoon Intensity</span> and <span className="font-medium text-slate-700">Deforestation</span> to <span className="font-medium text-slate-700">Inadequate Planning</span>, offering a comprehensive overview of regional susceptibilities to extensive flooding scenarios.
        </p>
      </div>
    </div>
  );
}
