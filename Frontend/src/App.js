import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ApiProvider from './contexts/ApiProvider';
import AuthProvider from './contexts/AuthProvider';


import OnboardingForm from './pages/OnboardingForm';
import OrgProfileForm from './pages/OrgProfileForm';
import OrgProfile from './pages/OrgProfile';
import DisplayPage from './pages/DisplayPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VolunteerForm from './pages/VolunteerForm';
import VolunteerPage from './pages/VolunteerPage';
import SelectUserTypePage from './pages/SelectUserTypePage';
import EstablishmentGuide from './pages/EstablishmentGuide';


function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/select-user-type" element={<SelectUserTypePage />} />
            <Route path="/volunteer-form" element={<VolunteerForm />} />

            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/home" element={<DisplayPage />} />
            <Route path="/find-gos" element={<DisplayPage />} />
            <Route path="/" element={<Navigate to="/find-gos" />} />
            
            <Route path="/onboarding" element={<OnboardingForm />} />
            <Route path="/org_profile_form" element={<OrgProfileForm />} />
            <Route path="/org_profile" element={<OrgProfile />} />

            <Route path="/establishment-guide" element={<EstablishmentGuide />} />
          </Routes>
        </ApiProvider>
        </AuthProvider>
    </BrowserRouter>
    </Container>
  );
}

export default App;
