type IPhoto = {
  photoUrl: string;
};

export const Photos = ({ photoUrl }: IPhoto) => {
  return (
    <img
      className="h-full w-full rounded-lg object-cover"
      src={photoUrl}
      alt=""
    />
  );
};
