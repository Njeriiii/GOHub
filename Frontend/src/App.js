import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ApiProvider from './contexts/ApiProvider';


import OnboardingForm from './pages/OnboardingForm';
import OrgProfileForm from './pages/OrgProfileForm';
import OrgProfile from './pages/OrgProfile';
import DisplayPage from './pages/DisplayPage';


function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <Routes>
            <Route path="/display" element={<DisplayPage />} />
            <Route path="/" element={<Navigate to="/display" />} />
            <Route path="/onboarding" element={<OnboardingForm />} />
            <Route path="/org_profile_form" element={<OrgProfileForm />} />
            <Route path="/org_profile" element={<OrgProfile />} />
          </Routes>
        </ApiProvider>
    </BrowserRouter>
    </Container>
  );
}

export default App;
