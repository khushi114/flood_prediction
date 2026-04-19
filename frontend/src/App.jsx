import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import FeatureImportance from './pages/FeatureImportance';
import Research from './pages/Research';
import Optimization from './pages/Optimization';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 w-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/features" element={<FeatureImportance />} />
            <Route path="/research" element={<Research />} />
            <Route path="/optimization" element={<Optimization />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
