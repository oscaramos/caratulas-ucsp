const apiUrl = 'http://54.193.19.36:4000/';

export const fetchGenerateCover = (data) => {
  console.log(data);
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'
    }
  };

  return fetch(apiUrl, options)
    .then(res=> res.json())
    .then(res => res.link)
}
