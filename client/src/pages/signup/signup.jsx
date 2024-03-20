import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiPost } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CircleLoader } from "react-spinners";
const ProgressBar = ({ step }) => {
  const totalSteps = 3;

  return (
    <div style={{ width: "100%", height: "2px", background: "#ddd" }}>
      <div
        style={{
          width: `${(step / totalSteps) * 100}%`,
          height: "100%",
          background: "#4caf50",
        }}
      />
    </div>
  );
};

const SignUp = () => {
  const [step, setStep] = useState(1);
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    symbol: false,
    length: false,
  });
  const [loading, setLoading] = useState(false);
  const [stepOneError, setStepOneError] = useState("");
  const [stepTwoError, setStepTwoError] = useState("");
  const [stepThreeError, setStepThreeError] = useState("");
  const [errors, setErrors] = useState({});
  const [stepThreeErrors, setStepThreeErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlefirstNameChange = (e) => {
    setFormData({ ...formData, firstName: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
    setErrorMessage("");
  };

  const handlelastNameChange = (e) => {
    setFormData({ ...formData, lastName: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
    setErrorMessage("");
  };

  const handlePhoneNumberChange = (e) => {
    setFormData({ ...formData, phoneNumber: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    setErrorMessage("");
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    checkPasswordRequirements(password);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    setErrorMessage("");
  };

  const checkPasswordRequirements = (password) => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[@$!%*?&#_+()&%^=]/;

    setPasswordRequirements({
      lowercase: lowercaseRegex.test(password),
      uppercase: uppercaseRegex.test(password),
      number: numberRegex.test(password),
      symbol: symbolRegex.test(password),
      length: password.length >= 8,
    });
  };

  const handleConfirmChange = (e) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
    setErrorMessage("");
  };

  const handleDOBChange = (e) => {
    setFormData({ ...formData, dob: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, dob: "" }));
    setErrorMessage("");
  };

  const onNext = () => {
    let errors = {};
    switch (step) {
      case 1:
        errors = validateStepOne(formData);
        break;
      case 2:
        errors = validateStepTwo(formData);
        break;
      case 3:
        errors = validateStepThree(formData);
        break;
      default:
        break;
    }

    if (Object.keys(errors).length === 0) {
      setStep((prevStep) => prevStep + 1);
    } else {
      setErrors(errors);
    }
  };

  const validateStepOne = (data) => {
    const errors = {};

    // Validate firstName
    if (!data.firstName || !data.firstName.trim()) {
      errors.firstName = "First Name is required";
    } else {
      delete errors.firstName;
    }

    // Validate lastName
    if (!data.lastName || !data.lastName.trim()) {
      errors.lastName = "Last Name is required";
    } else {
      delete errors.lastName;
    }

    // Validate email
    if (!data.email || !data.email.trim()) {
      errors.email = "Email is required";
    } else {
      delete errors.email;
    }
    return errors;
  };

  const validateStepTwo = (data) => {
    const errors = {};

    // Validate phoneNumber
    if (!data.phoneNumber || !data.phoneNumber.trim()) {
      errors.phoneNumber = "Mobile Number is required";
    } else {
      delete errors.phoneNumber;
    }

    if (!data.dob) {
      errors.dob = "D.O.B is required";
    } else {
      delete errors.dob;
    }

    return errors;
  };

  const validateStepThree = (data) => {
    const stepThreeErrors = {};

    // Validate password
    if (!data.password || !data.password.trim()) {
      errors.password = "Password is required";
    } else {
      delete errors.password;
    }

    // Validate confirmPassword
    if (!data.confirmPassword || !data.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    } else {
      delete errors.confirmPassword;
    }

    return stepThreeErrors;
  };

  const onBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };


  const isValidEmail = (email) => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");

    return (
      atIndex !== -1 && dotIndex > atIndex + 1 && dotIndex < email.length - 1
    );
  };

  const onCreate = async () => {
    const errors = validateStepThree(formData);

    if (Object.keys(errors).length > 0) {
      setStepThreeErrors(errors);
    } else {
      setStepThreeErrors({});
      setLoading(true);

      try {
        const postDataResult = await apiPost("/users/signup", formData);
        Swal.fire({
          icon: "success",
          title: "Account Created Successfully!",
          text: "Click on the link sent to your email to verify your account.",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            setLoading(false);
            Navigate("/users");
          }
        });
      } catch (error) {
        console.error("Error:", error);

        let errorMessageToShow =
          error.response.data.message ||
          "Please check your internet connection and try again.";

        if (error.response.status === 500) {
          errorMessageToShow = "Please try again.";
        }
        setErrorMessage(errorMessageToShow);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessageToShow,
        });
      }
    }
  };

  return (
    <div className="flex mt-10 items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-80">
        <h2 className=" mt-5 mb-6 capitalize text-center">
          {formData.firstName || "Sign Up"}
        </h2>
        <ProgressBar step={step} />
        {errorMessage && (
          <p className="text-red-500 text-xs mb-4">{errorMessage}</p>
        )}
        {step === 1 && (
          <div className="mt-5">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block font-semibold text-gray-800"
              >
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                id="firstName"
                className="border rounded w-full py-2 px-3 mt-1"
                value={formData.firstName}
                required
                onChange={handlefirstNameChange}
              />
              {errors && errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block font-semibold text-gray-800"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="border rounded w-full py-2 px-3 mt-1"
                value={formData.lastName}
                onChange={handlelastNameChange}
                required
              />
              {errors && errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-semibold text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 border rounded w-full"
                value={formData.email}
                onChange={handleEmailChange}
                required
              />
              {errors && errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-red-500 text-xs">Invalid email address</p>
              )}
            </div>

            <div className="relative items-center mb-5 pb-1 justify-between mt-5">
              <button
                className="p-2 pl-4 pr-4 mb-4 absolute right-1 rounded-md bg-white border border-gray-500 text-gray-500 "
                onClick={onNext}
              >
                Next
              </button>
            </div>

            {stepOneError && (
              <div className="text-red-500 text-xs mt-2">{stepOneError}</div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="mt-5">
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block font-semibold text-gray-800">
                Mobile Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="mt-1 p-2 border rounded w-full"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                required
              />
              {errors && errors.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="dob"
                className="block font-semibold text-gray-800" >
                Date Of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="mt-1 p-2 border rounded w-full"
                value={formData.dob}
                onChange={handleDOBChange}
                required
              />
              {errors && errors.dob && (
                <p className="text-red-500 text-xs">{errors.dob}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-5">
              <button
                className="bg-red-400 text-white p-2 pl-4 pr-4 rounded-md"
                onClick={onBack}
              >
                Back
              </button>
              <button
                className="p-2 pl-4 pr-4 rounded-md bg-white border border-gray-500 text-gray-500 left-align-button"
                onClick={onNext}
              >
                Next
              </button>
            </div>

            {stepTwoError && (
              <div className="text-red-500 text-xs mt-2">{stepTwoError}</div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="mt-5">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block font-semibold text-gray-800"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="mt-1 p-2 border rounded w-full"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-4 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {passwordRequirements.lowercase ? (
                <p className="text-green-500 text-xs">✓ Contains lowercase letter</p>
              ) : (
                <p className="text-red-500 text-xs">✘ Must contain lowercase letter</p>
              )}
              {passwordRequirements.uppercase ? (
                <p className="text-green-500 text-xs">✓ Contains uppercase letter</p>
              ) : (
                <p className="text-red-500 text-xs">✘ Must contain uppercase letter</p>
              )}
              {passwordRequirements.number ? (
                <p className="text-green-500 text-xs">✓ Contains number</p>
              ) : (
                <p className="text-red-500 text-xs">✘ Must contain number</p>
              )}
              {passwordRequirements.symbol ? (
                <p className="text-green-500 text-xs">✓ Contains symbol</p>
              ) : (
                <p className="text-red-500 text-xs">✘ Must contain symbol</p>
              )}
              {passwordRequirements.length ? (
                <p className="text-green-500 text-xs">✓ Minimum 8 characters</p>
              ) : (
                <p className="text-red-500 text-xs">✘ Must be at least 8 characters</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block font-semibold text-gray-800"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="mt-1 p-2 border rounded w-full"
                  value={formData.confirmPassword}
                  onChange={handleConfirmChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-4 text-gray-500"
                  onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors && errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-5">
              <button
                className="bg-red-400 text-white p-2 pl-4 pr-4 rounded-md"
                onClick={onBack}
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-[#00ccbb] text-white p-2 pl-4 pr-4 rounded-md font-semibold relative"
                disabled={loading}
                onClick={() => onCreate()}
              >
                {loading ? (
                  <>
                    <p className="gap-2 ml-4 flex items-center">
                      <CircleLoader color="#fff" size={20} />
                      <span className="">Submitting...</span>
                    </p>
                  </>
                ) : (
                  "Signup"
                )}
              </button>
            </div>
            {stepThreeError && (
              <div className="text-red-500 mt-2">{stepThreeError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
