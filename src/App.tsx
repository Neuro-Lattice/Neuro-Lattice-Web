import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Product from './pages/Product';
import Models from './pages/Models';


import Contact from './pages/Contact';
import HostedApiRequest from './pages/HostedApiRequest';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/models" element={<Models />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/hosted-api-request" element={<HostedApiRequest />} />
      </Routes>
    </Router>
  );
}

export default App;
