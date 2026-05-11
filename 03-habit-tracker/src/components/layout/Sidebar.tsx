import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Bot, Trophy, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '面板' },
  { to: '/stats', icon: BarChart3, label: '统计' },
  { to: '/coach', icon: Bot, label: 'AI教练' },
  { to: '/achievements', icon: Trophy, label: '成就' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
