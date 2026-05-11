import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { HabitProvider } from './contexts/HabitContext';
import { CheckInProvider } from './contexts/CheckInContext';
import { AchievementProvider } from './contexts/AchievementContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Statistics } from './pages/Statistics';
import { AICoach } from './pages/AICoach';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HabitProvider>
        <CheckInProvider>
          <AchievementProvider>
            {children}
          </AchievementProvider>
        </CheckInProvider>
      </HabitProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/coach" element={<AICoach />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
