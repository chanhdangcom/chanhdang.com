import { Rating } from "@mui/material";
import { useState } from "react";

export const RatingButton = () => {
  const [value, setValue] = useState<number | null>(
    Number(localStorage.getItem("RatingValue"))
  );

  return (
    <div>
      <Rating
        value={value}
        onChange={(event, newValue) => {
          localStorage.setItem("RatingValue", String(newValue));
          setValue(newValue);
        }}
      />
    </div>
  );
};
