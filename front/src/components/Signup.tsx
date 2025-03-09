import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import AuthAccess from "./AuthAccess";
import avatar from "../assets/icons8-avatar-96.png";

// Define apiClient using axios
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const schema = z.object({
  email: z.string().email("Invalid email"),
  userName: z.string().nonempty("Name is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  // const { ref, ...rest } = register("profile");
  // const [profile] = watch(["profile"]);

  // useEffect(() => {
  //   if (profile) {
  //     setImage(profile[0]);
  //   }
  // }, [profile]);
  const changeImage = (e: any) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data: FormData) => {
    //create new form data that includes image
    reset();
    const file = image;
    console.log("uploadImg");
    console.log(file);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      apiClient
        .post("/file?file=123.jpeg", formData, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status !== 200) {
            alert("An error occurred. Please try again.");
            return;
          }
          const url = res.data.url;
          const newUserData = {
            email: data.email,
            userName: data.userName,
            password: data.password,
            profileImageUrl: url,
          };
          axios
            .post("http://localhost:3000/auth/register", newUserData)
            .then((response) => {
              console.log(response);
              if (response.status === 201) {
                navigate("/");
              }
            })
            .catch((error) => {
              console.error(error);
              alert("An error occurred. Please try again.");
            });
        })
        .catch((err) => {
          console.log(err);
          alert("An error occurred. Please try again.");
        });
    } else {
      alert("Please upload an image");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light">
      <AuthAccess where_to_navigate="/signup" />
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "10px",
          margin: "0 10px",
        }}
      >
        <h2 className="text-center mb-4 font-weight-bold">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <img
                src={image ? URL.createObjectURL(image) : avatar}
                style={{ width: "200px", height: "200px", alignSelf: "center" }}
              />
              {/* <FontAwesomeIcon
                onClick={() => {
                  inputFileRef.current?.click();
                }}
                icon={faImage}
                className="fa-xl"
                style={{ position: "absolute", bottom: "0", right: "0" }}
              /> */}
            </div>
            <input
              // {...rest}
              // ref={(e) => {
              //   ref(e);
              //   inputFileRef.current = e;
              // }}
              onChange={changeImage}
              type="file"
              className="mb-3"
              accept="image/jpeg, image/png"
              // style={{ display: "none" }}
            />
          </div>
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
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              User name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              {...register("userName")}
              className={`form-control ${errors.userName ? "is-invalid" : ""}`}
            />
            {errors.userName && (
              <div className="invalid-feedback">{errors.userName.message}</div>
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
              <div className="invalid-feedback">{errors.password.message}</div>
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
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Sign up
          </button>
        </form>
        <div className="text-center mt-3">
          <a onClick={() => navigate("/")} className="text-decoration-none">
            Have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
