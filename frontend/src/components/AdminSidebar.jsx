import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Mealify Admin</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/">Back to Site</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
