import { Link, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebaseConfig";
import { getUserProfile } from "@/services/firestore";
const HomePage = () => {
  const navigate = useNavigate();

  const checkProfile = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;
    const profileExists = await getUserProfile(user.uid);
    if (!profileExists) return false;
    return true;
  };
  return (
    <div className="pt-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Logo/Icon */}
        <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
          <Link className="w-8 h-8 text-white" />
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            All your links in
            <br />
            <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              one place
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Share your entire online presence with a single link
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2 group"
          onClick={async () => {
            const user = auth.currentUser;
            if (!user) {
              navigate("/new");
            } else {
              if (await checkProfile()) {
                navigate(`/user/${user.uid}`);
              } else {
                navigate("/newProfile");
              }
            }
          }}
        >
          Get started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
