import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CardMedia } from "@mui/material";
import EditAccountInfoTab from "./tabs/EditAccountInfoTab";
import ChangePasswordTab from "./tabs/ChangePasswordTab";
import AccountInfoTab from "./tabs/AccountInfoTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const SettingPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: 500,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab
          label={
            <CardMedia
              component="img"
              image="logoHutech.png"
              alt="Ảnh không tồn tại"
              sx={{
                width: "300px",
                height: "auto",
                margin: "10px",
              }}
            />
          }
          {...a11yProps(0)}
        />
        <Tab label="Tài khoản" {...a11yProps(1)} />
        <Tab label="Mật khẩu" {...a11yProps(2)} />
        {/* <Tab label="Hình đại diện" {...a11yProps(2)} /> */}
      </Tabs>
      <TabPanel value={value} index={0}>
          <AccountInfoTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EditAccountInfoTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChangePasswordTab />
      </TabPanel>
    </Box>
  );
};

export default SettingPage;
