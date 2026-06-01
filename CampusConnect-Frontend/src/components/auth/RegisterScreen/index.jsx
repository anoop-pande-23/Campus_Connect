import React, { useState } from "react";
import { userService } from "../../../utils/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

const RegisterScreen = ({ onRegisterSuccess, onSwitchScreen }) => {
  const { login } = useAuth();
  const [accountType, setAccountType] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  // ... (other state variables remain the same)
  const [orgType, setOrgType] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegistration = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Create username based on account type
      const username =
        accountType === "organization"
          ? orgName.replace(/\s+/g, "_")
          : `${firstName}_${lastName}`.replace(/\s+/g, "_");

      const registrationPayload = {
        username: username,
        email: email,
        password: password,
      };

      // Add is_organization flag for organizations
      if (accountType === "organization") {
        registrationPayload.is_organization = "true";
      }

      console.log(registrationPayload, "payload");

      const result = await userService.registerUser(registrationPayload);

      // Store auth data if provided
      if (result.token) {
        console.log(result, "ress");
        // alert("heyy");
        login(result.user, result.token);

        // localStorage.setItem('authToken', result.token);
        // localStorage.setItem('userProfile', JSON.stringify(result.user));
      }

      onRegisterSuccess?.(result);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Key Changes here:
    // 1. **max-h-screen:** Limits the component to the screen height.
    // 2. **overflow-y-auto:** Adds vertical scrolling if content exceeds max-h.
    // 3. **p-6:** Reduced padding slightly for more vertical space.
    <div
      id="register-screen"
      // 👇 Removed max-h-screen and overflow-y-auto.
      // Added shadow-xl for a better lift effect.
      className="auth-screen bg-white w-full p-6 pt-12 mx-auto md:max-w-3xl md:p-10 rounded-xl"
      // className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 sm:p-8"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold text-2xl">CC</span>
        </div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-1">
          Join Campus Connect
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Create your account to start discovering events
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Key Change here: Added a new `div` for the form content to manage scrolling more cleanly on smaller screens if necessary, though the outer div's scrolling should handle it. Removed some top margin from `form`. */}
      <form onSubmit={handleRegistration} className="space-y-4">
        <div className="pt-2">
          {" "}
          {/* Added slight top padding to space out from the header */}
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            I am registering as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="accountType"
                value="student"
                checked={accountType === "student"}
                onChange={() => setAccountType("student")}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <div className="ml-3">
                <p className="font-semibold text-sm text-gray-900">Student</p>
                <p className="text-xs text-gray-600">Individual account</p>
              </div>
            </label>
            <label className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="accountType"
                value="organization"
                checked={accountType === "organization"}
                onChange={() => setAccountType("organization")}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <div className="ml-3">
                <p className="font-semibold text-sm text-gray-900">
                  Organization
                </p>
                <p className="text-xs text-gray-600">Club or society</p>
              </div>
            </label>
          </div>
        </div>
        {accountType === "organization" ? (
          <div id="student-fields">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Sarah"
                />
              </div>
            </div>
          </div>
        ) : (
          <div id="student-fields">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Sarah"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Johnson"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            University Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your.email@university.edu"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be a valid .edu email address
          </p>
        </div>

        {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                    <select required value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Select your university</option>
                        <option value="uc-berkeley">University of California, Berkeley</option>
                        <option value="stanford">Stanford University</option>
                        <option value="ucla">University of California, Los Angeles</option>
                        <option value="usc">University of Southern California</option>
                        <option value="other">Other (will be verified)</option>
                    </select>
                </div> */}

        {/* {accountType === 'student' && (
                    <div id="student-year">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Study</label>
                        <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">Select year</option>
                            <option value="freshman">Freshman</option>
                            <option value="sophomore">Sophomore</option>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                            <option value="graduate">Graduate Student</option>
                            <option value="phd">PhD Student</option>
                            <option value="faculty">Faculty/Staff</option>
                        </select>
                    </div>
                )} */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Create a strong password"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
          />
          <label className="ml-2 text-xs text-gray-600">
            I agree to the{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 font-semibold"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 font-semibold"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={onSwitchScreen}
            className="text-primary font-semibold hover:text-primary/80"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
