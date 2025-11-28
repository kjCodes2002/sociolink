import LinkComponent from "./LinkComponent";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
type LinkItem = {
  id: string;
  uid: string;
  url: string;
  platform: string;
};

type LinkSectionProps = {
  links: LinkItem[];
  isOwner: boolean;
  id: string | undefined;
};
const LinkSection = ({ links, isOwner, id }: LinkSectionProps) => {
  const navigate = useNavigate();
  if (!links || links.length === 0) return <>No links to show</>;
  return (
    <div className="pt-0">
      {isOwner && (
        <Button
          className="flex justify-self-end mb-4 max-w-20"
          variant={"outline"}
          onClick={() => navigate(`/user/${id}/edit`)}
        >
          Edit links
        </Button>
      )}
      <div className="flex flex-col gap-6 mb-8">
        {links.map((link) => (
          <LinkComponent
            key={link.id}
            platform={link.platform}
            url={link.url}
          />
        ))}
      </div>
    </div>
  );
};

export default LinkSection;
