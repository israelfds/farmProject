import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

// Pages
import Dashboard from './components/pages/Dashboard';
import Producers from './components/pages/Producers';
import Farms from './components/pages/Farms';

// Components
import Layout from './components/templates/Layout';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/producers" element={<Producers />} />
              <Route path="/farms" element={<Farms />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
