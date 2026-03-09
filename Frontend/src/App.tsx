import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DetailsPage from './pages/DetailsPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/details" element={<PageWrapper><DetailsPage /></PageWrapper>} />
        <Route path="/choose-plan" element={<PageWrapper><PlanSelectionPage /></PageWrapper>} />
        <Route path="/payment" element={<PageWrapper><PaymentPage /></PageWrapper>} />
        <Route path="/confirmation" element={<PageWrapper><ConfirmationPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
        <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
        <Route path="/refund-policy" element={<PageWrapper><RefundPolicy /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex-1 flex flex-col"
  >
    {children}
  </motion.div>
);

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Navbar />
    <main className="min-h-screen flex flex-col">
      <AnimatedRoutes />
    </main>
    <Footer />
  </BrowserRouter>
);

export default App;
