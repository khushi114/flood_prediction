import { Link, useLocation } from 'react-router-dom';
import { Waves, BarChart3, Info, Home as HomeIcon, LineChart, BookOpen, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-4 h-4" /> },
    { name: 'Predict', path: '/predict', icon: <Waves className="w-4 h-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Features', path: '/features', icon: <LineChart className="w-4 h-4" /> },
    { name: 'Research', path: '/research', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Optimization', path: '/optimization', icon: <Layers className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Waves className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden lg:block">
              Flood<span className="text-primary">Pred</span>
            </span>
          </Link>
          
          <div className="flex space-x-1 sm:space-x-2 md:space-x-4">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {link.icon}
                  <span className="hidden md:block">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
