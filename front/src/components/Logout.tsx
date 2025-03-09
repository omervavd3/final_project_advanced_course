import axios from "axios";

const Logout = () => {
  const logout = () => {
    axios
      .post(
        "http://localhost:3000/auth/logout",
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
        console.log(response.data);
        if (response.status == 200) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return <button
  className="btn btn-danger rounded-pill px-3 fw-bold"
  onClick={logout}
  style={{minWidth: "125px"}}
>
  🚪 Log Out
</button>
;
};

export default Logout;
