import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import AuthAccess from "./AuthAccess";
import Navbar from "./NavBar";
import { useNavigate } from "react-router";

type Post = {
  title: string;
  content: string;
  owner: string;
  ownerName: string;
  date: string;
  photo: string;
  comments: string[];
  likes: number;
  _id: string;
  ownerPhoto: string;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("user");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 6; 

  useEffect(() => {
    if (!document.cookie.includes("accessToken")) {
      navigate("/");
    } else {
      fetchPosts(currentPage);

      axios
        .get("http://localhost:3000/auth/getProfileImageUrlAndName", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        })
        .then((response) => {
          setProfileImage(response.data.profileImageUrl);
          setUserName(response.data.userName);
        })
        .catch((error) => {
          console.error(error);
          setProfileImage("");
        });
    }
  }, []);

  const fetchPosts = (page: number) => {
    axios
      .get(`http://localhost:3000/posts/getAllPagination/${page}/${limit}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        setPosts([]);
      });
  };

  useEffect(() => {
    console.log(currentPage)
    fetchPosts(currentPage);
  }, [currentPage]);

  return (
    <div className="container mt-4">
      <AuthAccess where_to_navigate="/" />

      {/* Navbar */}
      <Navbar userName={userName} profileImageUrl={profileImage} />

      {/* Posts Section */}
      <div className="row justify-content-center">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <Post
                title={post.title}
                content={post.content}
                photo={post.photo}
                likes={post.likes}
                _id={post._id}
                userName={userName}
                ownerPhoto={post.ownerPhoto}
                ownerName={post.ownerName}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No posts available</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3" style={{margin:"5px 0"}}>
        {currentPage > 1 && currentPage <= totalPages &&(
          <a href="#top" className="">
            <button
          className="btn btn-primary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Load Previous
        </button>
          </a>
        )}

        {currentPage < totalPages && (
          <a href="#top" className="">
            <button
          className="btn btn-primary"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Load More
        </button>
          </a>
        )}
      </div>
    </div>
  );
};

export default HomePage;
