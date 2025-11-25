import { auth } from "../services/firebaseConfig";
import { createUserProfile } from "@/services/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const CreateProfilePage = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!user) {
      navigate("/login");
      setLoading(false);
    }
    try {
      const res = await createUserProfile(
        formData.username,
        formData.bio,
        formData.image
      );
      if (!res.success && res.reason === "user_notfound") {
        setError("User is not logged in");
        return;
      }
      if (!res.success && res.reason === "already_exists") {
        setError("This user already has a profile");
        return;
      }
      navigate("/");
      console.log("User profile created");
    } catch (error) {
      console.log("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          required
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
          }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="w-28 h-28 rounded-full object-cover"
          />
        )}
        <Input
          placeholder="your name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Textarea
          placeholder="add your bio..."
          className="h-24"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          className="max-w-24 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Creating" : "Create"}
        </Button>
      </form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
};

export default CreateProfilePage;
