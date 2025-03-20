import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import Navbar from "./NavBar";
import AiModal from "./AiModal";
import Loader from "./Loader";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("user");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 6;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!document.cookie.includes("accessToken")) {
      window.location.href = "/";
    } else {
      setLoading(true);
      fetchPosts(currentPage);

      axios
        .get("https://node38.cs.colman.ac.il/auth/getProfileImageUrlAndName", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        })
        .then((response) => {
          setLoading(false);
          setProfileImage(response.data.profileImageUrl);
          setUserName(response.data.userName);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/";
        });
    }
  }, []);

  const fetchPosts = (page: number) => {
    setLoading(true);
    axios
      .get(`https://node38.cs.colman.ac.il/posts/getAllPagination/${page}/${limit}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        setLoading(false);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        setPosts([]);
      });
  };

  useEffect(() => {
    console.log(currentPage);
    fetchPosts(currentPage);
  }, [currentPage]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <Navbar userName={userName} profileImageUrl={profileImage} />

      {/* Posts Section */}
      <div className="row justify-content-center">
        {loading ? (
          <Loader />
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Pagination Controls */}
      <div
        className="d-flex justify-content-center mt-3"
        style={{ margin: "5px 0" }}
      >
        {currentPage > 1 && currentPage <= totalPages && (
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
      {/* Button to Open the Modal */}
      <button
        className="btn btn-info position-fixed bottom-0 right-0 m-3"
        onClick={toggleModal}
      >
        Chat with Gemini
      </button>

      {/* Modal Component */}
      <AiModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default HomePage;
