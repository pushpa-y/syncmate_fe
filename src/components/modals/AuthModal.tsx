import { useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from "../../services/auth";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Overlay,
  Modal,
  ImageSection,
  FormSection,
  BrandTitle,
  BrandSubtitle,
  Title,
  Input,
  Button,
  SwitchText,
  CloseButton,
} from "../../styles/AuthModal";

type AuthModalProps = {
  onClose: () => void;
  initialMode?: "login" | "signup";
};

const AuthModal = ({ onClose, initialMode = "login" }: AuthModalProps) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setError(null); // Clear errors when switching modes
  }, [initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  // Logic: Client-side validation
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isLogin && formData.name.trim().length < 2) {
      return "Please enter a valid name (at least 2 characters).";
    }
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(), // Emails should always be lowercase
      password: formData.password,
    };

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginUser({
          email: cleanData.email,
          password: cleanData.password,
        });
        auth?.login(res.data.token, res.data.user);

        toast.success(`Welcome back, ${res.data.user.name}!`);

        onClose();
        navigate("/dashboard");
      } else {
        await registerUser(cleanData);
        setIsLogin(true);
        setFormData((prev) => ({ ...prev, name: "", password: "" }));

        toast.success("Account created! Please login to continue.", {
          icon: "🚀",
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg); // Error popup
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ImageSection />

        <FormSection>
          <BrandTitle>SyncMate</BrandTitle>
          <BrandSubtitle>
            Smart expense tracking for everyday life
          </BrandSubtitle>

          <Title>{isLogin ? "Welcome Back" : "Create Account"}</Title>

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            )}

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              //   Check the field length as the user types
              value={formData.password}
              onChange={handleChange}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />

            {/* Error Message Display */}
            {error && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Syncing..." : isLogin ? "Login" : "Join SyncMate"}
            </Button>
          </form>

          <SwitchText>
            {isLogin ? "New here? " : "Joined us before? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
            >
              {isLogin ? "Create an account" : "Login now"}
            </span>
          </SwitchText>
        </FormSection>
      </Modal>
    </Overlay>
  );
};

export default AuthModal;
