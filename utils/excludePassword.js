exports.excludePassword = (data) => {
  const newUserData = {};
  const keys = Object.keys(data)?.filter((key) => key !== "password");

  keys?.forEach((key) => {
    newUserData[key] = data?.[key];
  });

  return newUserData;
};
