import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "@/services/firebaseConfig";
import { getUserProfile, editUserProfile } from "@/services/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
const EditProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    imageUrl: "",
    storagePath: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateLoading, setupdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.uid !== id) {
      navigate("/");
      return;
    }
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
          storagePath: userProfile.storagePath ?? "",
        });
      } catch (err: any) {
        setError(err.message || "Some error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  const handleChange = (name: string, value: string) => {
    setDisableSubmit(false);
    setUpdateError("");
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setupdateLoading(true);
      const res = await editUserProfile(
        profile.username,
        profile.bio,
        profile.storagePath,
        newImage
      );
      if (!res.success) {
        throw new Error(res.reason);
      }
      toast.success("Updated profile");
      navigate(`/user/${id}`);
    } catch (error: any) {
      console.log(error);
      setUpdateError(error.message || "Something went wrong");
    } finally {
      setupdateLoading(false);
    }
  };
  if (loading) return <>Loading...</>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative w-28 h-28">
          <img
            src={preview || profile.imageUrl}
            className="w-28 h-28 rounded-full object-cover cursor-pointer"
            onClick={() => document.getElementById("fileInput")?.click()}
          />

          {/* Hover overlay */}
          <div
            onClick={() => document.getElementById("fileInput")?.click()}
            className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition flex items-center justify-center text-white font-medium cursor-pointer"
          >
            Change
          </div>

          {/* Hidden input */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setDisableSubmit(false);
              const file = e.target.files?.[0];
              if (file) {
                setNewImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <Input
          placeholder="your name"
          name="username"
          value={profile.username}
          required
          onChange={(e) => handleChange("username", e.target.value)}
        />
        <Textarea
          placeholder="add your bio..."
          className="h-24"
          name="bio"
          value={profile.bio}
          required
          onChange={(e) => handleChange("bio", e.target.value)}
        />
        <Button
          type="submit"
          className="max-w-24 bg-green-600 hover:bg-green-700"
          disabled={updateLoading || disableSubmit}
        >
          {updateLoading ? "Updating" : "Update"}
        </Button>
      </form>
      {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
    </>
  );
};

export default EditProfilePage;
