import { useState } from "react";
import { Button } from "./ui/button";
import { logout } from "@/services/firebaseAuth";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";

const Navbar = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleClick = async () => {
    try {
      setError("");
      setLoading(true);
      if (user) {
        await logout();
        navigate("/login"); // logout takes user to login page
      } else {
        navigate("/login"); // guest clicking login just goes to login
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mb-8 flex justify-between">
      <h2
        className="text-3xl font-bold font-bricolage cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-mainTextDark">Socio</span>
        <span className="text-green-500">Link</span>
      </h2>
      <Button
        variant={user ? "outline" : "default"}
        size={"sm"}
        onClick={() => handleClick()}
        disabled={loading}
      >
        {user ? "Log Out" : "Log In"}
      </Button>
    </div>
  );
};

export default Navbar;
