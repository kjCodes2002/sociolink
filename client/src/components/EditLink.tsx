import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil, Trash } from "lucide-react";
type LinkProp = {
  id: string;
  uid: string;
  url: string;
  platform: string;
};
const EditLink = ({
  link,
  handleChange,
}: {
  link: LinkProp;
  handleChange: (id: string, name: string, value: string) => void;
}) => {
  const [enableEdit, setEnableEdit] = useState(true);
  return (
    <div className="flex gap-2">
      <Input
        value={link.platform}
        name="platform"
        onChange={(e) => handleChange(link.id, "platform", e.target.value)}
        disabled={enableEdit}
        required
      />
      <Input
        value={link.url}
        name="url"
        onChange={(e) => handleChange(link.id, "url", e.target.value)}
        disabled={enableEdit}
        required
      />
      <Button
        type="button"
        variant={"ghost"}
        className="max-w-8"
        onClick={() => {
          setEnableEdit(false);
        }}
      >
        <Pencil />
      </Button>
      {/* <Button variant={"secondary"} className="max-w-8" type="button">
        <Trash />
      </Button> */}
    </div>
  );
};

export default EditLink;
