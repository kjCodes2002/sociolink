import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { useEffect, useState } from "react";
import { getLinks, editLinks, deleteLink } from "@/services/firestore";
import { Button } from "@/components/ui/button";
import EditLink from "@/components/EditLink";
import { toast } from "sonner";
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
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = links.map((link) => ({
        id: link.id,
        url: link.url,
        platform: link.platform,
      }));
      const res = await editLinks(body);
      if (!res.success) {
        throw new Error(res.reason);
      }
      toast.success("Updated links successfully");
      navigate(`/user/${id}`);
    } catch (error: any) {
      console.log(error);
      setSubmitError(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      const res = await deleteLink(id);
      if (!res.success) {
        throw new Error(res.reason);
      }
      setLinks((prev) => prev.filter((item) => item.id !== id));
      toast.success("Successfully deleted");
    } catch (error: any) {
      console.log(error);
      setDeleteError(error.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
      {links.map((link) => (
        <EditLink
          key={link.id}
          link={link}
          handleChange={handleChange}
          handleDelete={handleDelete}
          deleting={deleting}
        />
      ))}
      <Button
        type="submit"
        className="max-w-28 bg-green-600 mt-4 hover:bg-green-700"
        disabled={saving}
      >
        Save changes
      </Button>
      {submitError && <p>{submitError}</p>}
      {deleteError && <p>{deleteError}</p>}
    </form>
  );
};

export default EditLinkPage;
