import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard data-icod-id="src_app_tsx_13e5" />} />
      </Routes>
    </BrowserRouter>
  );
}
