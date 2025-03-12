import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import axios from "axios";
import avatar from "../assets/icons8-avatar-96.png";

type AddPostProps = {
  userName: string;
  profileImageUrl: string;
};

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const schema = z.object({
  title: z.string().nonempty("Must have title"),
  content: z.string().nonempty("Must have caption"),
});

type FormData = z.infer<typeof schema>;

const AddPost: FC<AddPostProps> = ({ userName, profileImageUrl }) => {
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const changeImage = (e: any) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
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
          const newPostData = {
            title: data.title,
            content: data.content,
            photo: url,
            ownerName: userName,
            ownerPhoto: profileImageUrl,
          };
          axios
            .post("http://localhost:3000/posts", newPostData, {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${
                  document.cookie.split("accessToken=")[1].split(";")[0]
                }`,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.status === 201) {
                alert("Post created successfully");
                window.location.reload();
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container p-4 shadow rounded bg-light"
    >
      {/* Profile Image */}
      <div className="mb-3 text-center">
        <div className="position-relative d-flex justify-content-center">
          <img
            src={image ? URL.createObjectURL(image) : avatar}
            alt="Preview"
            className="border-secondary shadow-sm"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-3 text-center">
        <label className="form-label fw-bold">Upload Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/jpeg, image/png"
          onChange={changeImage}
        />
      </div>

      {/* Title Input */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-bold">
          Enter Title (location)
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter title"
          {...register("title")}
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title.message}</div>
        )}
      </div>

      {/* Caption Input */}
      <div className="mb-3">
        <label htmlFor="content" className="form-label fw-bold">
          Caption
        </label>
        <input
          type="text"
          id="content"
          placeholder="Enter caption"
          {...register("content")}
          className={`form-control ${errors.content ? "is-invalid" : ""}`}
        />
        {errors.content && (
          <div className="invalid-feedback">{errors.content.message}</div>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-100 mt-3">
        Post
      </button>
    </form>
  );
};

export default AddPost;
