import React from "react";
import { getLang } from "../../../common/utils/i18n";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  makeStyles,
  TextField,
  Chip,
  Box,
  Typography,
  fade,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
// import useFacilitiesMetadata from "../../../common/hooks/use-facilities-metadata";
import { csv } from "d3-fetch";
import useTimeSeriesStore from "../useTimeSeriesStore";
import {
  formatFacilityName,
  getFacilityColor,
} from "../../../common/utils/formatters";
import { FiberManualRecord } from "@material-ui/icons";
import ArrowDown from "@material-ui/icons/ArrowDropDown";
import CloseIcon from "../../../../content/assets/close-icon.svg";
import { sansSerifyTypography } from "../../../gatsby-theme-hypercore/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    margin: "15px 0 0",
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      maxWidth: "85%",
    },
  },
  placeholder: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& $chip": {
      display: "inline-flex",
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      border: 0,
    },
    "& li": {
      display: "inline-block",
      listStyle: "none",
    },
  },
  chip: {
    background: "none",
    border: "1px solid #DDDDCC",
  },
  list: {
    padding: 0,
    margin: 0,
    "& .MuiTypography-root": {
      ...sansSerifyTypography,
      top: "-2px",
      fontSize: theme.typography.pxToRem(15),
      position: "relative",
      color: "inherit",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "100%",
      overflow: "hidden",
    },
  },
  dialogText: {
    padding: theme.spacing(3),
    "& .MuiTypography-root": {
      fontSize: theme.typography.pxToRem(14),
      lineHeight: theme.typography.pxToRem(21),
      ...sansSerifyTypography,
      color: theme.palette.text.secondary,
      maxWidth: "390px",
    },
  },
  dialogActions: {
    padding: theme.spacing(3),
    color: "white",
    [theme.breakpoints.down("sm")]: {
      borderTop: "1px solid #E0E0E0",
    },
    "& .MuiButton-root": {
      width: "100%",
      maxWidth: "160px",
      backgroundColor: theme.palette.text.secondary,
      fontWeight: "300",
      [theme.breakpoints.down("sm")]: {
        maxWidth: "100%",
      },
    },
  },
  autocomplete: {
    paddingBottom: theme.spacing(1),
    backgroundImage:
      "repeating-linear-gradient(90deg,#C6C6B8,#C6C6B8 1.8px,transparent 0,transparent 7px)",
    backgroundPosition: "0 100%",
    backgroundSize: "100% 1.5px",
    backgroundRepeat: "no-repeat",
    "& .MuiAutocomplete-input": {
      marginTop: theme.spacing(1),
    },
    "& .MuiAutocomplete-popupIndicator": {
      color: theme.palette.secondary.main,
    },
  },
  button: {
    padding: 0,
    border: 0,
    border: `2px dotted transparent`,
    borderBottomColor: fade(theme.palette.text.secondary, 0.333),
    borderRadius: 5,
    "& .MuiButton-label": {
      color: theme.palette.secondary.main,
    },
  },
}));

const FacilitySelect = ({ defaultFacilities = [] }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [modalOpen, setModalOpen] = React.useState(false);
  const [allFacilities, setAllFacilities] = React.useState([]);
  const [setSelectedFacilities, selectedFacilities] = useTimeSeriesStore(
    (state) => [state.setSelectedFacilities, state.selectedFacilities]
  );
  const handleSelection = (event, selected) => setSelectedFacilities(selected);

  // load all facilities on initial load
  React.useEffect(() => {
    async function fetchData() {
      const allFacilities = await csv("./data/allFacilities.csv");
      setAllFacilities(allFacilities);
      const defaultSelected = defaultFacilities
        .map((facId) => allFacilities.find(({ id }) => id === facId))
        .filter((f) => !!f);
      setSelectedFacilities(defaultSelected);
    }
    fetchData();
  }, []);

  const openHandler = () => setModalOpen(true);
  const closeHandler = () => setModalOpen(false);

  return (
    <div className={classes.root}>
      <Box
        // onClick={openHandler}
        className={classes.placeholder}
        position="relative"
        display="flex"
        pr={6}
      >
        <Box pl={2} component="ul" className={classes.list}>
          {selectedFacilities.slice(0, 4).map((facility, i) => (
            <Chip
              classes={{ root: classes.chip }}
              component="li"
              icon={<FiberManualRecord style={{ fill: getFacilityColor(i) }} />}
              key={formatFacilityName(facility)}
              label={formatFacilityName(facility) + ";"}
              onDelete={null}
            />
          ))}
          {selectedFacilities.length > 4 && (
            <li>
              <Typography variant="body">
                +{selectedFacilities.length - 4}
              </Typography>
            </li>
          )}
        </Box>
        <Box
          clone
          position="absolute"
          width="100%"
          height="100%"
          justifyContent="flex-end"
        >
          <Button onClick={openHandler} className={classes.button}>
            <ArrowDown aria-label="edit facilities" />
          </Button>
        </Box>
      </Box>
      <Dialog
        aria-labelledby="dialog-title"
        open={modalOpen}
        onClose={closeHandler}
        fullScreen={isMobile}
      >
        <DialogTitle id="dialog-title" className={classes.dialogText}>
          {getLang("time_series_facility_select")}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            className={classes.autocomplete}
            multiple
            value={selectedFacilities}
            id="facility-autocomplete"
            options={allFacilities}
            onChange={handleSelection}
            getOptionLabel={formatFacilityName}
            renderOption={(option) => option.name}
            groupBy={({ state }) => (state === "*other" ? "" : state)}
            // size="small"
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, i) => (
                <Chip
                  deleteIcon={<img src={CloseIcon} alt="remove" />}
                  classes={{
                    deleteIcon: classes.deleteIcon,
                    root: classes.chip,
                  }}
                  icon={
                    <FiberManualRecord style={{ fill: getFacilityColor(i) }} />
                  }
                  label={formatFacilityName(option)}
                  {...getTagProps({ index: i })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Facilities"
                placeholder="Add location"
                InputProps={{ ...params.InputProps, disableUnderline: true }}
              />
            )}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={closeHandler}
            variant="contained"
            disableElevation
            color="inherit"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FacilitySelect;
