import { TableRow, TableCell, TableBody } from "@mui/material";

const LogCard = ({ location, message, createdAt }) => {
  const date = new Date(createdAt).toLocaleString();
  return (
    <TableBody>
      <TableRow>
        <TableCell>{location}</TableCell>
        <TableCell>{message}</TableCell>
        <TableCell>{date}</TableCell>
      </TableRow>
    </TableBody>
  );
};

export default LogCard;
