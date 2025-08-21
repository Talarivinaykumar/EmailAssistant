import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmailList from './pages/EmailList';
import EmailDetail from './pages/EmailDetail';
import NewEmail from './pages/NewEmail';
import TeamManagement from './pages/TeamManagement';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/emails" element={<EmailList />} />
          <Route path="/emails/new" element={<NewEmail />} />
          <Route path="/emails/:id" element={<EmailDetail />} />
          <Route path="/teams" element={<TeamManagement />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
