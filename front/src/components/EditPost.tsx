import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import avatar from "../assets/icons8-avatar-96.png";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const schema = z.object({
  title: z.string(),
  content: z.string(),
});

type FormData = z.infer<typeof schema>;

const EditPost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [postPhotoUrl, setPostPhotoUrl] = useState<string>("");

  const id = window.location.pathname.split("/")[2];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/posts/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setPostPhotoUrl(response.data.photo);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const changeUpdateImage = (e: any) => {
    console.log(e.target.files[0]);
    setPhoto(e.target.files[0]);
    setPostPhotoUrl(URL.createObjectURL(e.target.files[0]));
  };

  const updatePost = async (data: FormData) => {
    let url; 
    if (photo && URL.createObjectURL(photo) != postPhotoUrl) {
        const formData = new FormData();
        formData.append("file", photo);
        console.log(photo)
        await apiClient
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
            console.log(res.data.url)
            url = res.data.url
          })
          .catch((err) => {
            console.log(err);
            alert("An error occurred. Please try again.");
          });
      }
  
      if(data) {
        console.log(postPhotoUrl)
          await axios
        .put(`http://localhost:3000/posts/${id}`, {
          title: data.title ? data.title : title,
          content: data.content ? data.content : content,
          photo: url ? url : postPhotoUrl,
        }, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        })
        .then((response) => {
          console.log(response);
          alert("Post updated successfully");
          // navigate("/");
        })
        .catch((error) => {
          console.error(error);
        });
      }
  }

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
    updatePost(data);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
  <div className="card shadow-lg p-4" style={{ width: "100%" }}>
    <h1 className="text-center mb-4">Edit Post</h1>

    {/* Back & Delete Buttons */}
    <div className="d-flex justify-content-between mb-3">
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-primary"
      >
        <i className="bi bi-arrow-left"></i> Back to Home
      </button>
      <button className="btn btn-danger">
        <i className="bi bi-trash"></i> Delete Post
      </button>
    </div>

    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Profile Image & Upload */}
      <div className="text-center mb-4">
        <img
          src={postPhotoUrl || avatar}
          className="border border-secondary rounded-circle"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
        <input
          type="file"
          className="form-control mt-3"
          accept="image/jpeg, image/png"
          onChange={changeUpdateImage}
        />
      </div>

      {/* Title Input */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-bold">Title</label>
        <input
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          id="title"
          value={title}
          {...register("title")}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
      </div>

      {/* Content Input */}
      <div className="mb-3">
        <label htmlFor="content" className="form-label fw-bold">Content</label>
        <textarea
          className="form-control"
          id="content"
          rows={5}
          value={content}
          {...register("content")}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        {errors.content && <div className="invalid-feedback">{errors.content.message}</div>}
      </div>

      {/* Update Button */}
      <button type="submit" className="btn btn-primary w-100 mt-3">
        <i className="bi bi-pencil"></i> Update Post
      </button>
    </form>
  </div>
</div>

  );
};

export default EditPost;
