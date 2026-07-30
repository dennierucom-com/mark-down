import React from 'react';
import { Popover, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import SubjectIcon from '@mui/icons-material/Subject';
import TitleIcon from '@mui/icons-material/Title';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TableChartIcon from '@mui/icons-material/TableChart';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

interface AddSectionPopoverProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  onInsert: (template: string) => void;
}

export const AddSectionPopover: React.FC<AddSectionPopoverProps> = ({ anchorEl, onClose, onInsert }) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <List dense sx={{ width: 200 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('\n\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><SubjectIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Paragraph" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('## New Heading\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><TitleIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Heading" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('```\n\n```')}>
            <ListItemIcon sx={{ minWidth: 36 }}><CodeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Code Block" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('- Item 1\n- Item 2\n- Item 3\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><FormatListBulletedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Bullet List" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('1. Item 1\n2. Item 2\n3. Item 3\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><FormatListNumberedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Numbered List" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('| Column 1 | Column 2 |\n| -------- | -------- |\n| Text     | Text     |\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><TableChartIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Table" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('> Quote text\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><FormatQuoteIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Blockquote" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onInsert('---\n')}>
            <ListItemIcon sx={{ minWidth: 36 }}><HorizontalRuleIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Divider" />
          </ListItemButton>
        </ListItem>
      </List>
    </Popover>
  );
};
