import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ApiProvider from './contexts/ApiProvider';


import OnboardingForm from './pages/OnboardingForm';
import OrgProfileForm from './pages/OrgProfileForm';
import OrgProfile from './pages/OrgProfile';


function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" />} />
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
