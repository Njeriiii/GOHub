import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ApiProvider from './contexts/ApiProvider';
import AuthProvider from './contexts/AuthProvider';
import TranslationProvider, { TranslatedContent } from './contexts/TranslationProvider';


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
            <TranslationProvider>
              <Routes>
                <Route path="/login" element={
                  <TranslatedContent>
                    <LoginPage />
                  </TranslatedContent>
                } />
                <Route path="/signup" element={
                  <TranslatedContent>
                    <SignupPage />
                  </TranslatedContent>
                } />
                <Route path="/select-user-type" element={
                  <TranslatedContent>
                    <SelectUserTypePage />
                  </TranslatedContent>
                } />
                <Route path="/volunteer-form" element={
                  <TranslatedContent>
                    <VolunteerForm />
                  </TranslatedContent>
                } />
                <Route path="/volunteer" element={
                  <TranslatedContent>
                    <VolunteerPage />
                  </TranslatedContent>
                } />
                <Route path="/home" element={
                  <TranslatedContent>
                    <DisplayPage />
                  </TranslatedContent>
                } />
                <Route path="/find-gos" element={
                  <TranslatedContent>
                    <DisplayPage />
                  </TranslatedContent>
                } />
                <Route path="/" element={<Navigate to="/find-gos" />} />
                <Route path="/onboarding" element={
                  <TranslatedContent>
                    <OnboardingForm />
                  </TranslatedContent>
                } />
                <Route path="/org_profile_form" element={
                  <TranslatedContent>
                    <OrgProfileForm />
                  </TranslatedContent>
                } />
                <Route path="/org_profile" element={
                  <TranslatedContent>
                    <OrgProfile />
                  </TranslatedContent>
                } />
                <Route path="/establishment-guide" element={
                  <TranslatedContent>
                    <EstablishmentGuide />
                  </TranslatedContent>
                } />
              </Routes>
            </TranslationProvider>
          </ApiProvider>
        </AuthProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;
