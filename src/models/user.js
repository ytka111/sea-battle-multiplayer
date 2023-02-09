export const handleLogin = async (username, password) => {
  try {
    const { data } = await axios.post(
      `https://sea-battle-server-production.up.railway.app/auth/login`,
      {
        username,
        password,
      }
    );
    localStorage.setItem("data", JSON.stringify(data));
    location.href = "/";
  } catch (error) {
    const infoDisplay = document.createElement("div");
      infoDisplay.classList = "form__message form__message--error";
      infoDisplay.id = "info";
      infoDisplay.textContent = `${error.response.data.message}`;
    const button = document.querySelector(".form__button").textContent;
      error.response.data.message;
    button.insertAdjacentElement("afterend", infoDisplay);
  }
};

export const handleRegistration = async (username, password) => {
  try {
    const { data } = await axios.post(
      `https://sea-battle-server-production.up.railway.app/auth/registration`,
      { username, password }
    );
    location.href = "/login";
  } catch (error) {
   const infoDisplay = document.createElement("div");
      infoDisplay.classList = "form__message form__message--error";
      infoDisplay.id = "info";
      infoDisplay.textContent = `${error.response.data.message}`;
    const button = document.querySelector(".form__button").textContent;
      error.response.data.message;
    button.insertAdjacentElement("afterend", infoDisplay);
  }
};
