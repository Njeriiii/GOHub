import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ApiProvider from './contexts/ApiProvider';
import AuthProvider from './contexts/AuthProvider';
import TranslationProvider from './contexts/TranslationProvider';


import OnboardingForm from './pages/OnboardingForm';
import OrgProfileForm from './pages/OrgProfileForm';
import OrgProfile from './pages/OrgProfile';
import DisplayPage from './pages/DisplayPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VolunteerForm from './pages/VolunteerForm';
import VolunteerPage from './pages/VolunteerPage';
import SelectUserTypePage from './pages/SelectUserTypePage';
import EstablishmentGuide from './pages/EstablishmentGuide';
import EditProfile from './pages/EditProfilePage';
import EditVolunteerProfilePage from './pages/EditVolunteerProfilePage';
import ProfileImages from "./components/OrgProfileFormComponents/ProfileImages";
import ProposalBuilderPage from './pages/ProposalBuilderPage';
import AboutUsPage from './pages/AboutUsPage';
import FoundersResourcesPage from './pages/FoundersResourcesPage';


function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <TranslationProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/select-user-type" element={<SelectUserTypePage />} />
              <Route path="/volunteer-form" element={<VolunteerForm />} />

              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/home" element={<DisplayPage />} />
              <Route path="/find-gos" element={<DisplayPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/founder-resources" element={<FoundersResourcesPage />} />
              <Route path="/onboarding" element={<OnboardingForm />} />
              <Route path="/org_profile_form" element={<OrgProfileForm />} />
              <Route path="/org_profile" element={<OrgProfile />} />
              <Route path="/upload-images" element={<ProfileImages />} />
              <Route path="/edit_profile" element={<EditProfile />} />
              <Route path="/volunteer/edit" element={<EditVolunteerProfilePage />} />

              <Route path="/establishment-guide" element={<EstablishmentGuide />} />
              <Route path="/proposal-builder" element={<ProposalBuilderPage />} />
            </Routes>
          </TranslationProvider>
        </ApiProvider>
      </AuthProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;
