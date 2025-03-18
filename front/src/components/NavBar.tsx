import { FC, useState } from "react";
// import { useNavigate } from "react-router-dom";
import AddPost from "./AddPost"; // Import your AddPost component
import Logout from "./Logout";

type NavbarProps = {
  userName: string;
  profileImageUrl: string;
};

const Navbar: FC<NavbarProps> = ({ userName, profileImageUrl }) => {
  const [showModal, setShowModal] = useState(false);
  // const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3 mb-4">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Profile Picture + Username */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="rounded-circle border border-secondary me-2"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            )}
            <span className="fw-bold text-dark">{userName}</span>
          </a>

          {/* Navbar Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav d-flex align-items-center">
              {/* Add Post Button */}
              <li className="nav-item ms-3">
                <button
                  className="btn btn-outline-primary rounded-pill px-3"
                  onClick={() => setShowModal(true)}
                  style={{minWidth: "125px"}}
                >
                  + Add Post
                </button>
              </li>

              {/* Edit User Button */}
              <li className="nav-item ms-3">
                <button
                  className="btn btn-outline-secondary rounded-pill px-3"
                  onClick={() => window.location.href = "/editUser"}
                  style={{minWidth: "125px", margin:"5px 0"}}
                >
                  ✏️ Edit User
                </button>
              </li>

              {/* Logout */}
              <li className="nav-item ms-3">
                <Logout />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Bootstrap Modal for AddPost */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  style={{minWidth: "125px"}}
                ></button>
              </div>
              <div className="modal-body">
                <AddPost
                  userName={userName}
                  profileImageUrl={profileImageUrl}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-3"
                  style={{minWidth: "125px"}}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
