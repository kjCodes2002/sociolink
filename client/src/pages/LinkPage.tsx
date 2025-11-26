import Hero from "../components/Hero";
import LinkSection from "../components/LinkSection";
import Footer from "../components/Footer";
import { getLinks } from "@/services/firestore";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserProfile } from "@/services/firestore";
import { auth } from "@/services/firebaseConfig";
const LinkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    imageUrl: "",
  });
  const [links, setLinks] = useState([
    {
      id: "",
      uid: "",
      url: "",
      platform: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = auth.currentUser;
  const isOwner = user ? user.uid === id : false;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        const userProfile = await getUserProfile(id);
        if (!userProfile) {
          navigate("*");
          return;
        }

        setProfile({
          username: userProfile.username,
          bio: userProfile.bio,
          imageUrl: userProfile.imageUrl ?? "",
        });

        const res = await getLinks(id);
        if (!res.success) {
          const errorMsg = res.reason || "Failed to retrieve links";
          throw new Error(errorMsg);
        }

        setLinks(res.results || []);
      } catch (err: any) {
        setError(err.message || "Some error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) return <>Loading...</>;
  return (
    <div>
      <Hero profile={profile} id={id} isOwner={isOwner} />
      <LinkSection links={links} error={error} isOwner={isOwner} id={id} />
      <Footer isOwner={isOwner} />
    </div>
  );
};

export default LinkPage;
