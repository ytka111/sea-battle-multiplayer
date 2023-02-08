export const handleLogin = async (username, password) => {
  try {
    const { data } = await axios.post(
      `http://sea-battle-server-production.up.railway.app/auth/login`,
      {
        username,
        password,
      }
    );
    localStorage.setItem("data", JSON.stringify(data));
    location.href = "/";
  } catch (error) {
    console.error(error.response.data.message);
    document.querySelector(".form__message--error").textContent =
      error.response.data.message;
  }
};

export const handleRegistration = async (username, password) => {
  try {
    const { data } = await axios.post(
      `http://sea-battle-server-production.up.railway.app/auth/registration`,
      { username, password }
    );
    location.href = "/login";
  } catch (error) {
    console.error(error.response.data.message);
    document.querySelector(".form__message--error").textContent =
      error.response.data.message;
  }
};
