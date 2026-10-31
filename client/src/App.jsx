import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Specialties from './pages/Specialties';
import Hospitals from './pages/Hospitals';
import HospitalDetail from './pages/HospitalDetail';
import Join from './pages/Join';
import About from './pages/About';
import Saved from './pages/Saved';
import NotFound from './pages/NotFound';
import useTheme from './hooks/useTheme';
import useSaved from './hooks/useSaved';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const savedHook = useSaved();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar theme={theme} toggleTheme={toggleTheme} savedCount={savedHook.saved.length} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home savedHook={savedHook} />} />
            <Route path="/doctors" element={<Doctors savedHook={savedHook} />} />
            <Route path="/doctors/:slug" element={<DoctorProfile savedHook={savedHook} />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/:slug" element={<HospitalDetail savedHook={savedHook} />} />
            <Route path="/join" element={<Join />} />
            <Route path="/about" element={<About />} />
            <Route path="/saved" element={<Saved savedHook={savedHook} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
