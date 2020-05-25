import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchGenerateCover } from './api';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const defaultData = {
  career: 'Computer Science',
  course: 'Microprocessors',
  work: 'Real final job',
  gender: 'M',
  names: ['Oscar Daniel Ramos Ramirez'],
  semester: 'VIII Semester',
  year: '1999',
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  textField: {
    display: "block"
  }
}));

function App() {
  const [url, setUrl] = useState('');
  const [career, setCareer] = useState(defaultData.career);
  const [course, setCourse] = useState(defaultData.course);
  const [work, setWork] = useState(defaultData.work);
  const [gender, setGender] = useState(defaultData.gender);
  const [names, setNames] = useState(defaultData.names);
  const [semester, setSemester] = useState(defaultData.semester);
  const [year, setYear] = useState(defaultData.year);
  const classes = useStyles();

  const generateCover = () => {
    const data = { career, course, work, gender, names, semester, year }

    fetchGenerateCover(data)
      .then(pdfUrl => {
        setUrl(pdfUrl);
      })
  }

  const setInput = (value, name) => {
    switch (name) {
      case 'career':
        setCareer(value);
        break;
      case 'course':
        setCourse(value);
        break;
      case 'work':
        setWork(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'names':
        setNames(value);
        break;
      case 'semester':
        setSemester(value);
        break;
      case 'year':
        setYear(value);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <form className={classes.root} noValidate autoComplete='off'>
        <TextField className={classes.textField} label='career' defaultValue={career}
                   onChange={(event) => setInput(event.target.value, 'career')} />
        <TextField className={classes.textField} label='course' defaultValue={course}
                   onChange={(event) => setInput(event.target.value, 'course')} />
        <TextField className={classes.textField} label='work' defaultValue={work}
                   onChange={(event) => setInput(event.target.value, 'work')} />
        <TextField className={classes.textField} label='gender' defaultValue={gender}
                   onChange={(event) => setInput(event.target.value, 'gender')} />
        <TextField className={classes.textField} label='name' defaultValue={names[0]}
                   onChange={(event) => setInput(event.target.value, 'names')} />
        <TextField className={classes.textField} label='semester' defaultValue={semester}
                   onChange={(event) => setInput(event.target.value, 'semester')} />
        <TextField className={classes.textField} label='year' defaultValue={year}
                   onChange={(event) => setInput(event.target.value, 'year')} />

        <Button variant='contained' color='primary'
                onClick={() => generateCover()}>
          Send
        </Button>
      </form>
      Link a pdf=<a href={url}>{url}</a>
    </div>
  )
    ;
}

export default App;
