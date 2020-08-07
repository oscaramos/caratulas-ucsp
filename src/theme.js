import { createMuiTheme } from '@material-ui/core/styles';

const arcBlue = "#1A5BA0";
const arcOrange = "#FFBA60";
const background = "#dfdbd9";

const theme = createMuiTheme({
  palette: {
    common: {
      blue: arcBlue,
      orange: arcOrange
    },
    primary: {
      main: arcBlue
    },
    secondary: {
      main: arcOrange
    },
    background: {
      default: background
    }
  },
  typography: {
    tab: {
      fontFamily: "Raleway",
      textTransform: "none",
      fontWeight: '700',
      fontSize: "1rem",
    },
    estimate: {
      fontFamily: "Pacifico",
      fontSize: "1rem",
      textTransform: "none",
      color: "white"
    },
    h2: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: '2.5em',
      color: `${arcBlue}`,
      lineHeight: 1.5
    },
    caption: {
      fontFamily: 'Raleway',
      fontWeight: 400,
      fontSize: '0.75em',
      color: `${background}`,
      lineHeight: 1.66
    }
  },
  //MuiOutlinedInput-adornedEnd
  overrides: {
    MuiOutlinedInput: {
      adornedEnd: {
        paddingRight: 0
      }
    }
  }
});

export default theme;
