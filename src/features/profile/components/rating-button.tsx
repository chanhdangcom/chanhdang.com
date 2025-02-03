import { Rating } from "@mui/material";
import { StarIcon } from "lucide-react";
import { useState } from "react";

export const RatingButton = () => {
  const [value, setValue] = useState<number | null>(
    Number(localStorage.getItem("RatingValue"))
  );

  return (
    <div>
      <Rating
        value={value}
        precision={0.5}
        emptyIcon={<StarIcon fontSize="inherit" style={{ color: "#27272a" }} />}
        onChange={(event, newValue) => {
          localStorage.setItem("RatingValue", String(newValue));
          setValue(newValue);
        }}
      />
    </div>
  );
};
