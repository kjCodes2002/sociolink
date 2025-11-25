import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type LinkProp = {
  id: string;
  uid: string;
  url: string;
  platform: string;
};
const EditLink = ({
  link,
  handleChange,
  handleDelete,
  deleting,
}: {
  link: LinkProp;
  handleChange: (id: string, name: string, value: string) => void;
  handleDelete: (id: string) => void;
  deleting: boolean;
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
      {/* DELETE BUTTON WITH ALERT */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="max-w-8"
            disabled={deleting}
          >
            <Trash />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the link.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(link.id)}
              className="bg-red-500 hover:bg-red-600
              "
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditLink;
