export const sleep = async (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

export const isAdmin = (user) => {
  return user && user.role === "ADMIN";
};
