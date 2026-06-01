import React, { useState } from 'react';

const OnboardingScreen = ({ onOnboardingComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 3;

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onOnboardingComplete();
        }
    };

    const skipTour = () => {
        onOnboardingComplete();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="onboarding-step">
                        {/* ... (Discover Events content) ... */}
                    </div>
                );
            case 1:
                return (
                    <div className="onboarding-step">
                        {/* ... (Create Events content) ... */}
                    </div>
                );
            case 2:
                return (
                    <div className="onboarding-step">
                        {/* ... (Connect & Network content) ... */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id="onboarding-screen" className="auth-screen bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            {/* ... (Welcome header) ... */}
            <div id="onboarding-content">
                {renderStepContent()}
            </div>
            <div className="flex items-center justify-between mt-8">
                <div className="flex space-x-2">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full onboarding-dot ${index === currentStep ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    ))}
                </div>
                <div className="flex space-x-3">
                    <button onClick={skipTour} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold">
                        Skip Tour
                    </button>
                    <button onClick={nextStep} id="next-btn" className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        {currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;