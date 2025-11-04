import { Link } from "react-router-dom";

const ProfileButton = () => {
  return (
    <Link to="/dashboard/profile" className="icon-container">
      <button className="btn btn-apli-invert">
        <span className="material-icons">person</span>
      </button>
      <div className="hover-text">Perfil</div>
    </Link>
  );
};

export default ProfileButton;
