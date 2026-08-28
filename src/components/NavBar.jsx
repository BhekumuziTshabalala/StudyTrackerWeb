import { NavLink } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, TrendingUp, BookOpen, Settings } from 'lucide-react';

const NavBar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Curriculum', path: '/curriculum', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex flex-col w-20 lg:w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0">
        <div className="flex items-center justify-center lg:justify-start lg:px-6 h-16 border-b border-slate-700">
          <span className="text-xl font-bold text-slate-100 hidden lg:block">Dolphin</span>
          <span className="text-xl font-bold text-slate-100 lg:hidden">D</span>
        </div>
        <div className="flex flex-col flex-1 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center lg:justify-start lg:px-6 py-3 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`
              }
              title={item.name}
            >
              <item.icon size={24} />
              <span className="ml-3 font-medium hidden lg:block">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
