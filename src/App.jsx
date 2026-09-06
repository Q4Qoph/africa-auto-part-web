import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VinSearchPage from './pages/VinSearchPage';
import VehiclePartsPage from './pages/VehiclePartsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VinSearchPage />} />
        <Route path="/vehicle/:vehicleId" element={<VehiclePartsPage />} />
      </Routes>
    </BrowserRouter>
  );
}