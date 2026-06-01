import React from 'react';

const VerificationScreen = ({ email, onVerificationSuccess, onSwitchScreen }) => {
    return (
        <div id="verification-screen" className="auth-screen bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-8">
                {/* ... (Email icon and headings) ... */}
                <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-600">We've sent a verification link to <span id="verification-email" className="font-semibold text-primary">{email}</span></p>
            </div>
            <div className="space-y-6">
                {/* ... (Info box with next steps) ... */}
                <button onClick={onVerificationSuccess} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    I've Verified My Email
                </button>
                {/* ... (Resend email and back buttons) ... */}
            </div>
        </div>
    );
};

export default VerificationScreen;