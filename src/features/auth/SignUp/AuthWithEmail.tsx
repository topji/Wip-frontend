import { useCreateMagicUser } from "@/hooks/api-interaction/useCreateUser";
import { useSearchParams } from "react-router";
import loader from "@/assets/loader.svg";
import { useState } from "react";

interface AuthSectionFormData {
  email: string;
  password: string;
}

// interface PasswordChecks {
//   hasMinLength: boolean;
//   hasNumberOrSymbol: boolean;
//   notContainsNameEmail: boolean;
// }

const AuthWithEmail = ({
  setError,
  redirectOnSuccess,
}: {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  redirectOnSuccess: () => void;
}) => {
  const [formData, setFormData] = useState<AuthSectionFormData>({
    email: "",
    password: "",
  });

  const [searchParams] = useSearchParams();
  const paramsCategory = searchParams.get("category");

  const createUserMutation = useCreateMagicUser({
    onSuccess: () => {
      redirectOnSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // const [passwordStrength, setPasswordStrength] = useState<
  //   "Weak" | "Medium" | "Strong"
  // >("Weak");

  // const [checks, setChecks] = useState<PasswordChecks>({
  //   hasMinLength: false,
  //   hasNumberOrSymbol: false,
  //   notContainsNameEmail: true,
  // });
  // const validatePassword = (password: string, email: string) => {
  //   const hasMinLength = password.length >= 8;
  //   const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  //   const notContainsNameEmail =
  //     !email ||
  //     !password.toLowerCase().includes(email.toLowerCase().split("@")[0]);

  //   setChecks({
  //     hasMinLength,
  //     hasNumberOrSymbol,
  //     notContainsNameEmail,
  //   });

  //   const passedChecks = [
  //     hasMinLength,
  //     hasNumberOrSymbol,
  //     notContainsNameEmail,
  //   ].filter(Boolean).length;

  //   if (passedChecks === 3) {
  //     setPasswordStrength("Strong");
  //   } else if (passedChecks >= 2) {
  //     setPasswordStrength("Medium");
  //   } else {
  //     setPasswordStrength("Weak");
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // if (name === "password" || name === "email") {
    //   validatePassword(
    //     name === "password" ? value : formData.password,
    //     name === "email" ? value : formData.email
    //   );
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      category: paramsCategory,
    });
    createUserMutation.mutate({
      ...formData,
      category: paramsCategory,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Id
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter Email Id"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter Password"
          required
        />
        <div className="mt-2 px-5 space-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span
              className={`${
                passwordStrength === "Weak"
                  ? "text-gray-400"
                  : passwordStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              ✓
            </span>
            Password Strength:{" "}
            <span className="font-medium">{passwordStrength}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                checks.notContainsNameEmail ? "text-green-500" : "text-gray-400"
              }
            >
              ✓
            </span>
            Cannot contain your name or email address
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                checks.hasMinLength ? "text-green-500" : "text-gray-400"
              }
            >
              ✓
            </span>
            At least 8 characters
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                checks.hasNumberOrSymbol ? "text-green-500" : "text-gray-400"
              }
            >
              ✓
            </span>
            Contains a number or symbol
          </div>
        </div>
      </div> */}

      <button
        type="submit"
        disabled={createUserMutation.isPending}
        className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-md font-medium"
      >
        {createUserMutation.isPending ? (
          <span className="animate-spin text-white">
            <img src={loader} alt="loading..." />
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default AuthWithEmail;
