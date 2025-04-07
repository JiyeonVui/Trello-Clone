import { Menu, MenuItem } from '@mui/material'
import Box from '@mui/material/Box'
import { useState } from 'react'

const VideoPlayer = () => {

  const [videoSrc, setVideoSrc] = useState('http://localhost:3000/video/video1.mp4')

  const changeVideo = (fileName) => {

    setVideoSrc(`http://localhost:3000/video/${fileName}`)

  }

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <video width="640" height="360" controls key={videoSrc}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <br />
      <h1>Your browser does not support the video tag {videoSrc.toString()}.</h1>
      <Menu
        id="basic-menu-video"
        anchorEl={null}
        open={open}
        onClose={() => { }}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={() => changeVideo('video1.mp4')}>Video 1</MenuItem>
        <MenuItem onClick={() => changeVideo('video2.mp4')}>Video 2</MenuItem>
        <MenuItem onClick={() => changeVideo('video3.mp4')}>Video 3</MenuItem>
      </Menu>
    </Box>
  )
}

export default VideoPlayer
