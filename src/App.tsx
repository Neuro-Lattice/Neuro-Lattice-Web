import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Product from './pages/Product';
import Models from './pages/Models';


import Contact from './pages/Contact';
import HostedApiRequest from './pages/HostedApiRequest';
import HowItWorks from './pages/HowItWorks';
import Proof from './pages/Proof';
import Developers from './pages/Developers';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/models" element={<Models />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/proof" element={<Proof />} />
        <Route path="/developers" element={<Developers />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/hosted-api-request" element={<HostedApiRequest />} />
      </Routes>
    </Router>
  );
}


export default App;
