import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Bot, Trophy, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '面板' },
  { to: '/stats', icon: BarChart3, label: '统计' },
  { to: '/coach', icon: Bot, label: 'AI教练' },
  { to: '/achievements', icon: Trophy, label: '成就' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
