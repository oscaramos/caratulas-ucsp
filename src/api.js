export const fetchGenerateCover = (data) => {
  const url = 'http://localhost:4000/';

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
