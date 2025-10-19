import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import TeamListPage from './pages/TeamListPage';
import TeamFormPage from './pages/TeamFormPage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/" element={<TeamListPage />} />
        <Route path="/team/new" element={<TeamFormPage />} />
        <Route path="/team/:id" element={<TeamFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
