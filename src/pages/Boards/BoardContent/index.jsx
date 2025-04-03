import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      width: '100%',
      height: (themes) => `calc(100vh - ${themes.trello.appBarHeight} - ${themes.trello.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent