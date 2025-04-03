import Box from '@mui/material/Box'
// eslint-disable-next-line import/no-unresolved
import ModeSelect from '../ModeSelect'

function AppBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      width: '100%',
      height: (themes) => themes.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center'
    }}>
      <ModeSelect />
    </Box>
  )
}

export default AppBar