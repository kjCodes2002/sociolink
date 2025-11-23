import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { useEffect, useState } from "react";
import { getLinks } from "@/services/firestore";
import { Button } from "@/components/ui/button";
import EditLink from "@/components/EditLink";
const EditLinkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }
        if (user.uid !== id) {
          navigate("/");
          return;
        }
        const res = await getLinks(id);
        if (!res.success) {
          const errorMsg = res.reason || "Failed to retrieve links";
          throw new Error(errorMsg);
        }

        setLinks(res.results || []);
      } catch (err: any) {
        console.log(err);
        setError(err.message || "Some error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (id: string, name: string, value: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
    );
  };

  if (loading) return <>Loading...</>;
  if (!links || links.length === 0)
    return (
      <div className="flex flex-col items-start gap-4 mt-6">
        <p>No links to edit</p>
        <Button onClick={() => navigate("/new")}>Add links</Button>
      </div>
    );
  if (error) return <>{error}</>;
  return (
    <div className="flex flex-col gap-4">
      {links.map((link) => (
        <EditLink key={link.id} link={link} handleChange={handleChange} />
      ))}
    </div>
  );
};

export default EditLinkPage;
