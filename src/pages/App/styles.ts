import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    paddingLeft: "10%",
    paddingRight: "10%",
    height: "100vh",
    position: "relative",
  },
  formContainer: {
    height: "100%",
    maxWidth: 400,
    flexWrap: "nowrap",
  },
  wrapperSubmitButton: {
    position: "relative",
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  footerTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: "100%",
    textAlign: "center",
  },
}));
