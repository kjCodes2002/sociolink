import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "@/services/firebaseConfig";
import { getUserProfile, editUserProfile } from "@/services/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
const EditProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    imageUrl: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateLoading, setupdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
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
        });
      } catch (err: any) {
        setError(err.message || "Some error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  if (loading) return <>Loading...</>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <>
      <form className="flex flex-col gap-4">
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
        />
        <Textarea
          placeholder="add your bio..."
          className="h-24"
          name="bio"
          value={profile.bio}
          required
        />
        <Button
          type="submit"
          className="max-w-24 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {updateLoading ? "Updating" : "Update"}
        </Button>
      </form>
      {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
    </>
  );
};

export default EditProfilePage;
