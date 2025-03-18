import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().nonempty("Password is required"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const checkAuth = async () => {
    if (
      document.cookie.includes("accessToken") &&
      document.cookie.includes("refreshToken")
    ) {
      navigate("/home");
    } else if (document.cookie.includes("refreshToken")) {
      await axios
        .post(
          "http://localhost:3000/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${
                document.cookie.split("refreshToken=")[1].split(";")[0]
              }`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            navigate("/home");
          }
        })
        .catch((error) => {
          console.error(error);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    reset();
    console.log(data);
    axios
      .post("http://localhost:3000/auth/login", data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Username or password is incorrect.");
      });
  };

  const googleSuccessResponse = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse)
    axios
      .post("http://localhost:3000/auth/google", credentialResponse, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 200) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Google login failed.");
      });
  };

  const googleErrorResponse = () => {
    console.log("Google login failed.");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />
              <label className="form-check-label" htmlFor="showPassword">
                Show Password
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <GoogleLogin
          onSuccess={googleSuccessResponse}
          onError={googleErrorResponse}
        />
        <div className="text-center mt-3">
          <a
            onClick={() => navigate("/signup")}
            className="text-decoration-none"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
