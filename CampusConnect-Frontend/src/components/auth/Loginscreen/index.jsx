import { useAuth } from '../../../contexts/AuthContext';
import React, { useState } from 'react';
import { userService } from '../../../utils/apiClient';

const LoginScreen = ({ onLoginSuccess, onSwitchScreen }) => {
     const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // State for form inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const loginPayload = {
                username: username,
                email: email,
                password: password
            };

            const result = await userService.authenticateUser(loginPayload);
            
            // Store auth data if provided
            if (result.token) {
                login(result.user_id, result.token);
                // localStorage.setItem('authToken', result.token);
                // localStorage.setItem('userProfile', JSON.stringify(result.user));
                
                // If remember me is checked, store for longer period
                if (rememberMe) {
                    localStorage.setItem('rememberUser', 'true');
                }
            }
            
            onLoginSuccess?.(result);
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            console.log(message,"message")
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="login-screen" className="auth-screen bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">CC</span>
                </div>
                <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to continue to Campus Connect</p>
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input 
                        type="text" 
                        required 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="Enter your username" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="your.email@university.edu" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="Enter your password" 
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={(e) => setRememberMe(e.target.checked)} 
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button 
                        type="button" 
                        className="text-sm text-primary hover:text-primary/80 font-semibold"
                    >
                        Forgot password?
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Don't have an account? 
                    <button 
                        onClick={onSwitchScreen} 
                        className="text-primary font-semibold hover:text-primary/80 ml-1"
                    >
                        Create one here
                    </button>
                </p>
            </div>

            {/* Optional: Social login or additional features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                    <p>By signing in, you agree to our</p>
                    <div className="space-x-2">
                        <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                        <span>and</span>
                        <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;