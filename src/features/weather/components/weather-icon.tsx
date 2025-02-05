type IPorp = {
  icon: string;
};
export const WeatherIcon = ({ icon }: IPorp) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  return (
    <div>
      <img src={iconUrl} alt="icon" width={50} />
    </div>
  );
};
