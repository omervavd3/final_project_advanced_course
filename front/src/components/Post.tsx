import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import heart_black from "../assets/heart_black.png";
import heart_red from "../assets/heart_red.png";
// import { useNavigate } from "react-router";
import trash from "../assets/trash.png";
import Loader from "./Loader";

type PostProps = {
  title: string;
  content: string;
  photo: string;
  likes: number;
  _id: string;
  userName: string;
  ownerName: string;
  ownerPhoto: string;
};

type comment = {
  _id: string;
  comment: string;
  ownerName: string;
};

const Post: FC<PostProps> = ({
  title,
  content,
  photo,
  likes,
  _id,
  userName,
  ownerName,
  ownerPhoto,
}) => {
  const schema = z.object({
    comment: z.string().nonempty("Comment is required"),
  });

  // const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [heart, setHeart] = useState(heart_black);
  const [numOfLikes, setNumOfLikes] = useState(likes);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(false);

  type FormData = z.infer<typeof schema>;

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/comments/getByPostId/${_id}/${page}/3`, {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setComments(response.data.comments);
        setTotalPages(response.data.totalPages);
        setTotalComments(response.data.totalComments);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    if (liked) {
      setHeart(heart_red);
    } else {
      setHeart(heart_black);
    }
    if (numOfLikes == 0) {
      setHeart(heart_black);
    }
  }, [liked]);

  const handleLike = () => {
    setLoading(true);
    const value = liked ? -1 : 1;
    setNumOfLikes(numOfLikes + value);
    setLiked(!liked);
    axios
      .post(
        `http://localhost:3000/likes`,
        {
          postId: _id,
          value: value,
        },
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .post(
        `http://localhost:3000/likes/getByUserAndPost`,
        {
          postId: _id,
        },
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        if (response.data.length === 0) {
          setLiked(false);
          setHeart(heart_black);
        } else {
          setLiked(true);
          setHeart(heart_red);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        setLiked(false);
        setHeart(heart_black);
      });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    console.log(data);
    reset();
    axios
      .post(
        "http://localhost:3000/comments",
        {
          postId: _id,
          comment: data.comment,
          ownerName: userName,
        },
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        fetchComments();
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleDeleteComment = (commentId: string) => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        fetchComments();
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleEditPost = (_id: string) => {
    // navigate(`/editPost/${_id}`);
    window.location.href = `/editPost/${_id}`;
  };

  return (
    <div
      className="card mx-auto shadow-sm border-light d-flex flex-column"
      style={{ maxWidth: "400px", borderRadius: "15px", minHeight: "596px" }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* User Info */}
          <div className="d-flex align-items-center p-2">
            <img
              src={ownerPhoto}
              alt="User"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <span className="fw-bold">{ownerName}</span>
            <span className="text-muted ms-auto">{title}</span>
            {userName === ownerName && (
              <span
                className="ms-2 text-primary cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => handleEditPost(_id)}
              >
                Edit
              </span>
            )}
          </div>

          {/* Post Image */}
          <div className="text-center">
            <img
              src={photo}
              alt="Post"
              className="img-fluid w-100"
              style={{
                height: "250px",
                objectFit: "cover",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            />
          </div>

          {/* Like, Comment, Share Icons */}
          <div className="d-flex justify-content-between align-items-center px-3 py-2">
            <div>
              <img
                src={heart}
                alt="like"
                className="me-2 cursor-pointer"
                onClick={handleLike}
                style={{ width: "24px", cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Likes Count */}
          <p className="px-3 mb-1">
            <strong>Likes: {numOfLikes}</strong>
          </p>

          {/* Post Content */}
          <div className="px-3">
            <p className="mb-1">
              <strong>{ownerName}</strong> {content}
            </p>
          </div>

          {/* Comments Section */}
          {comments.length > 0 ? (
            <p className="px-3 mb-1 text-muted">
              Total comments: {totalComments}
            </p>
          ) : (
            <p className="px-3 mb-1 text-muted">No comments</p>
          )}
          <div
            className="px-3 flex-grow-1"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          >
            {comments.map((comment: comment) => (
              <div
                key={comment._id}
                className="d-flex justify-content-between align-items-center mb-1"
              >
                <p className="mb-0">
                  <strong>{comment.ownerName}</strong> {comment.comment}
                </p>
                {(userName === comment.ownerName || userName === ownerName) && (
                  <img
                    src={trash}
                    alt="delete"
                    className="cursor-pointer ms-2"
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{ width: "16px", height: "16px", cursor: 'pointer' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="px-3 text-center">
            {totalPages >= page && 1 < page && (
              <button
                className="btn btn-sm text-muted"
                onClick={() => setPage(page - 1)}
                style={{ cursor: 'pointer' }}
              >
                Load previous
              </button>
            )}
            {totalPages > 1 && totalPages > page && (
              <button
                className="btn btn-sm text-muted"
                onClick={() => setPage(page + 1)}
                style={{ cursor: 'pointer' }}
              >
                Load more
              </button>
            )}
          </div>

          {/* Comment Input - Sticks to Bottom */}
          <div className="px-3 py-2 mt-auto bg-white">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="d-flex align-items-center"
            >
              <input
                type="text"
                {...register("comment")}
                className={`form-control form-control-sm me-2 ${
                  errors.comment ? "is-invalid" : ""
                }`}
                placeholder="Add a comment..."
              />
              {errors.comment && (
                <div className="invalid-feedback">{errors.comment.message}</div>
              )}
              <button type="submit" className="btn btn-sm btn-primary">
                Post
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
