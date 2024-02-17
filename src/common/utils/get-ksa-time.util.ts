export const ksaTime = () => {
  const now = new Date();
  const ksaOffsetMinutes = 3 * 60; // KSA (UTC+3) offset in minutes
  const ksaTime = new Date(now.getTime() + ksaOffsetMinutes * 60 * 1000);

  return ksaTime;
};
