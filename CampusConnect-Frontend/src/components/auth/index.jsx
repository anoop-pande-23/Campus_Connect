import React, { useState } from "react";
import LoginScreen from "./Loginscreen";
import RegisterScreen from "./RegisterScreen";
import VerificationScreen from "./VerificationScreen";
import OnboardingScreen from "./OnboardingScreen";

const AuthScreen = ({ onAuthSuccess }) => {
  const [currentAuthScreen, setCurrentAuthScreen] = useState("login");
  const [emailForVerification, setEmailForVerification] = useState("");

  const handleRegistration = (email) => {
    setEmailForVerification(email);
    setCurrentAuthScreen("login");
  };

  const handleVerification = () => {
    setCurrentAuthScreen("onboarding");
  };

  return (
    <div
      id="auth-overlay"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {currentAuthScreen === "login" && (
        <LoginScreen
          onLoginSuccess={onAuthSuccess}
          onSwitchScreen={() => setCurrentAuthScreen("register")}
        />
      )}
      {currentAuthScreen === "register" && (
        <RegisterScreen
          onRegisterSuccess={handleRegistration}
          onSwitchScreen={() => setCurrentAuthScreen("login")}
        />
      )}
      {/* {currentAuthScreen === 'verification' && <VerificationScreen email={emailForVerification} onVerificationSuccess={handleVerification} onSwitchScreen={() => setCurrentAuthScreen('register')} />}
            {currentAuthScreen === 'onboarding' && <OnboardingScreen onOnboardingComplete={onAuthSuccess} />} */}
    </div>
  );
};

export default AuthScreen;
