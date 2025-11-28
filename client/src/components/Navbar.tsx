import { useState } from "react";
import { Button } from "./ui/button";
import { logout } from "@/services/firebaseAuth";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      {!user && (
        <Button size={"sm"} onClick={() => handleClick()} disabled={loading}>
          Log In
        </Button>
      )}
      {/* logout */}
      {user && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              disabled={loading}
            >
              Log Out
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Do you want to log out?</AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleClick()}
                className="bg-red-500 hover:bg-red-600
              "
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Navbar;
