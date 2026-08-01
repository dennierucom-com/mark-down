import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useFileActions } from "../hooks/useFileActions";
import { useDialog } from "../context/DialogContext";

export const ActionSpeedDial: React.FC = () => {
  const { handleOpenFolder, handleManualInject, clearFiles } = useFileActions();
  const { requestSaveDialog } = useDialog();

  const speedDialActions = [
    { icon: <FolderOpenIcon />, name: "Open Folder", onClick: handleOpenFolder },
    { icon: <AddIcon />, name: "Add File", onClick: handleManualInject },
    { icon: <DeleteSweepIcon />, name: "Clear Workspace", onClick: clearFiles },
    { icon: <SaveIcon />, name: "Save", onClick: requestSaveDialog },
  ];

  return (
    <SpeedDial
      ariaLabel="File actions"
      sx={{ position: "fixed", bottom: 32, right: 32 }}
      icon={<SpeedDialIcon />}
    >
      {speedDialActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};
