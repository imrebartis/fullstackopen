import React from 'react'
import { ListItemText, ListItemIcon } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const Comment = ({ content }) => {
  return (
    <>
      <ListItemIcon>
        <FiberManualRecordIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={content} />
    </>
  )
}

export default Comment
