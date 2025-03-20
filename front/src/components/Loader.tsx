import { Circles } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Circles height="80" width="80" ariaLabel="loading" />
    </div>
  );
};

export default Loader;
