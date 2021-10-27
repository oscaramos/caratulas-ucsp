import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemContainer: {
    width: "100%",
  },
  semesterInput: {
    width: "60%",
    display: "inline",
  },
  yearInput: {
    width: "40%",
    display: "inline",
  },
}));
