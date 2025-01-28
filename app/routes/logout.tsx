import { useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../DB/firebase";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    auth.signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }, [navigate]);

  return <div>Logging out...</div>;
}
