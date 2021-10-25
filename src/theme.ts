import { createTheme } from "@material-ui/core/styles";

const arcBlue = "#1A5BA0";
const arcOrange = "#FFBA60";
const background = "#dfdbd9";

const theme = createTheme({
  palette: {
    primary: {
      main: arcBlue,
    },
    secondary: {
      main: arcOrange,
    },
    background: {
      default: background,
    },
  },
  typography: {
    h1: {
      fontFamily: `'Noto Sans JP', sans-serif`,
      fontSize: "2.5rem",
    },
    h2: {
      fontFamily: "Raleway",
      fontWeight: 700,
      fontSize: "2.5em",
      color: `${arcBlue}`,
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: "Raleway",
      fontWeight: 400,
      fontSize: "0.75em",
      color: `${background}`,
      lineHeight: 1.66,
    },
  },
  overrides: {
    MuiOutlinedInput: {
      adornedEnd: {
        paddingRight: 0,
      },
    },
  },
});

export default theme;
