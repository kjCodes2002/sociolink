import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
const Footer = ({ isOwner }: { isOwner: boolean }) => {
  const [copying, setCopying] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <Link
        to="/new"
        className="py-2 px-3 rounded-md bg-black/70 hover:bg-black/60 text-white font-semibold mb-5"
      >
        {isOwner ? "Add more links" : "Create your link"}
      </Link>
      {isOwner && (
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700 cursor-pointer"
          disabled={copying}
          onClick={async () => {
            setCopying(true);
            const copyUrl = window.location.href;
            const type = "text/plain";
            const clipboardItemData = {
              [type]: copyUrl,
            };
            const clipboardItem = new ClipboardItem(clipboardItemData);
            await navigator.clipboard.write([clipboardItem]);
            setTimeout(() => {
              setCopying(false);
            }, 3000);
          }}
        >
          {copying ? "Copied" : "Copy URL"}
        </Button>
      )}
    </div>
  );
};

export default Footer;
