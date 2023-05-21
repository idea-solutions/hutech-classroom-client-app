import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { blue } from "@mui/material/colors";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Divider } from "@mui/material";
import { Classroom } from "../../../app/models/Classroom";

const classroom = {
  id: "123",
  title: "CMP123",
  description: "Thuc hanh Java",
  lecturerName: "Nguyen Van A",
  room: "E1-01.03",
  class: "20DTHD3",
};

interface ClassroomCardProps {
  classroom: Classroom
}

const ClassroomCard = (props: ClassroomCardProps) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        textAlign: "start",
        borderWidth: 2,
        transition: "border-color 0.3s, box-shadow 0.3s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
        },
      }}
      variant="outlined"
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[800] }} aria-label="classroom-icon">
            <SchoolIcon />
          </Avatar>
        }
        action={
          <IconButton
            aria-label="more"
            sx={{
              transition: "color 0.2s",
              "&:hover": {
                color: blue[800],
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={props.classroom.title}
        subheader={props.classroom.description}
      />
      <CardMedia
        component="img"
        height="194"
        image={`banner${Math.floor(Math.random() * (3 - 1 + 1)) + 1}.png`}
        alt="banner-classroom"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {`Giang vien: ${props.classroom.lecturer?.firstName} ${props.classroom.lecturer?.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Phong: ${props.classroom.room}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Lop: ${props.classroom.class}`}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <IconButton
            aria-label="assignment"
            sx={{
              transition: "color 0.2s",
              "&:hover": {
                color: blue[800],
              },
            }}
          >
            <AssignmentIcon />
          </IconButton>
          <IconButton
            aria-label="everybody"
            sx={{
              transition: "color 0.2s",
              "&:hover": {
                color: blue[800],
              },
            }}
          >
            <GroupsIcon />
          </IconButton>
        </div>
        <IconButton
          aria-label="go-details"
          sx={{
            transition: "color 0.2s",
            "&:hover": {
              color: blue[800],
            },
          }}
        >
          <ArrowCircleRightIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ClassroomCard;
