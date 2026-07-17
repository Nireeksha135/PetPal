import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PetsList from "./pages/PetsList";
import PetProfile from "./pages/PetProfile";
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import MedicineList from "./pages/MedicineList";
import AddMedicine from "./pages/AddMedicine";
import MedicineDetail from "./pages/MedicineDetail";
import EditMedicine from "./pages/EditMedicine";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pets" element={<PetsList />} />
          <Route path="/pets/new" element={<AddPet />} />
          <Route path="/pets/:petId/edit" element={<EditPet />} />
          <Route path="/pets/:petId" element={<PetProfile />} />
          <Route path="/medicine" element={<MedicineList />} />
          <Route path="/medicine/new" element={<AddMedicine />} />
          <Route path="/medicine/:medicineId/edit" element={<EditMedicine />} />
          <Route path="/medicine/:medicineId" element={<MedicineDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
