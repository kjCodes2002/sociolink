import pfp from "../assets/images/me.jpeg";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
type ProfileProps = {
  username: string;
  bio: string;
  imageUrl: string;
};
const Hero = ({
  profile,
  id,
  isOwner,
}: {
  profile: ProfileProps;
  id: string | undefined;
  isOwner: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-3 mb-8">
      <div>
        <img
          src={profile.imageUrl === "" ? pfp : profile.imageUrl}
          alt="profile-pic"
          className="w-28 h-28 rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="font-bold text-xl text-mainTextDark">
          {profile.username}
        </h3>
        <p className="font-medium text-mainTextLight">{profile.bio}</p>
      </div>
      {isOwner && (
        <Button
          variant={"outline"}
          onClick={() => {
            navigate(`/user/${id}/editProfile`);
          }}
          className="ml-auto"
        >
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default Hero;
