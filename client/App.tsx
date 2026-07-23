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
import VaccinationList from "./pages/VaccinationList";
import AddVaccination from "./pages/AddVaccination";
import VaccinationDetail from "./pages/VaccinationDetail";
import EditVaccination from "./pages/EditVaccination";
import DewormingList from "./pages/DewormingList";
import AddDeworming from "./pages/AddDeworming";
import DewormingDetail from "./pages/DewormingDetail";
import EditDeworming from "./pages/EditDeworming";
import FleaTickList from "./pages/FleaTickList";
import AddFleaTick from "./pages/AddFleaTick";
import FleaTickDetail from "./pages/FleaTickDetail";
import EditFleaTick from "./pages/EditFleaTick";
import VetVisitList from "./pages/VetVisitList";
import AddVetVisit from "./pages/AddVetVisit";
import VetVisitDetail from "./pages/VetVisitDetail";
import EditVetVisit from "./pages/EditVetVisit";
import DocumentsList from "./pages/DocumentsList";
import DocumentDetail from "./pages/DocumentDetail";
import AIPetDoctor from "./pages/AIPetDoctor";
import AIConsultationDetail from "./pages/AIConsultationDetail";
import AskPetPal from "./pages/AskPetPal";
import DietAssistant from "./pages/DietAssistant";
import DietPlanDetail from "./pages/DietPlanDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home" element={<Home />} />
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
          <Route path="/vaccinations" element={<VaccinationList />} />
          <Route path="/vaccinations/new" element={<AddVaccination />} />
          <Route
            path="/vaccinations/:vaccinationId/edit"
            element={<EditVaccination />}
          />
          <Route
            path="/vaccinations/:vaccinationId"
            element={<VaccinationDetail />}
          />
          <Route path="/deworming" element={<DewormingList />} />
          <Route path="/deworming/new" element={<AddDeworming />} />
          <Route path="/deworming/:recordId/edit" element={<EditDeworming />} />
          <Route path="/deworming/:recordId" element={<DewormingDetail />} />
          <Route path="/flea-tick" element={<FleaTickList />} />
          <Route path="/flea-tick/new" element={<AddFleaTick />} />
          <Route path="/flea-tick/:treatmentId/edit" element={<EditFleaTick />} />
          <Route path="/flea-tick/:treatmentId" element={<FleaTickDetail />} />
          <Route path="/vet-visits" element={<VetVisitList />} />
          <Route path="/vet-visits/new" element={<AddVetVisit />} />
          <Route path="/vet-visits/:visitId/edit" element={<EditVetVisit />} />
          <Route path="/vet-visits/:visitId" element={<VetVisitDetail />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/:documentId" element={<DocumentDetail />} />
          <Route path="/ai-pet-doctor" element={<AIPetDoctor />} />
          <Route
            path="/ai-pet-doctor/:consultationId"
            element={<AIConsultationDetail />}
          />
          <Route path="/ask-petpal" element={<AskPetPal />} />
          <Route path="/ask-petpal/:sessionId" element={<AskPetPal />} />
          <Route path="/diet-assistant" element={<DietAssistant />} />
          <Route path="/diet-assistant/:planId" element={<DietPlanDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
