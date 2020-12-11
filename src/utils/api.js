const apiUrl = "https://caratulas-ucsp-api-proxy.vercel.app/api/cover";

export const fetchGenerateCover = (data) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(apiUrl, options)
    .then((res) => res.json())
    .then((res) => res.link);
};
