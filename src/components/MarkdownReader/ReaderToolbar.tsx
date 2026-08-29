import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EditIcon from "@mui/icons-material/Edit";

interface ReaderToolbarProps {
  isFullscreen: boolean;
  isEditMode: boolean;
  isElectricMode: boolean;
  toggleFullscreen: () => void;
  toggleEditMode: () => void;
  toggleElectricMode: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  isFullscreen,
  isEditMode,
  isElectricMode,
  toggleFullscreen,
  toggleEditMode,
  toggleElectricMode,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1,
        display: "flex",
        gap: 1,
      }}
    >
      {!isFullscreen && (
        <Tooltip title={isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}>
          <IconButton onClick={toggleEditMode} color={isEditMode ? "primary" : "default"}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={isElectricMode ? "Disable Electric Mode" : "Enable Electric Mode"}>
        <IconButton onClick={toggleElectricMode} color={isElectricMode ? "warning" : "default"}>
          <ElectricBoltIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
        <IconButton onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
