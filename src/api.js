const url = process.env.NODE_ENV.includes('development') ? 'http://localhost:4000/' : 'https://caratulas-ucsp-api.herokuapp.com/';

export const fetchGenerateCover = (data) => {
  console.log(data);
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'
    }
  };

  return fetch(url, options)
    .then(res=> res.json())
    .then(res => res.link)
}
