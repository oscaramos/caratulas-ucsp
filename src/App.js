import React, { useState } from 'react';
import { fetchGenerateCover } from './api';

const data = {
  career: 'Computer Science',
  course: 'Microprocessors',
  work: 'Real final job',
  gender: 'M',
  names: ['Oscar Daniel Ramos Ramirez'],
  semester: 'VIII Semester',
  year: '1999',
}

function App() {
  const [url, setUrl] = useState('');

  const generateCover = () => {
    fetchGenerateCover(data)
      .then(pdfUrl => {
        console.log(pdfUrl);
        setUrl(pdfUrl);
      })
  }

  return (
    <div>
      <button onClick={generateCover}>Holo</button>
      <br />
      Link a pdf=<a href={url}>{url}</a>
    </div>
  )
    ;
}

export default App;
