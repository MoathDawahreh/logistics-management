export const jordanTime = () => {
  const now = new Date();
  const jordanOffsetMinutes = 3 * 60; // Jordan (UTC+3) offset in minutes
  const jordanTime = new Date(now.getTime() + jordanOffsetMinutes * 60 * 1000);

  return jordanTime;
};
