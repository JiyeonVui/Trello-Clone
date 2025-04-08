import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ListItemText from '@mui/material/ListItemText'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment'



const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

function BoardContent() {

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      p: '10px 0'
    }}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/* COLUMN 1 */}
        <Box sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
          // (theme) = `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
          {/* header */}
          <Box sx={{
            height: COLUMN_HEADER_HEIGHT,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant='h6' sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Column Title
            </Typography>
            <Box>
              <Tooltip title = 'More options'>
                <ExpandMoreIcon
                  sx={{
                    color: 'text.primary',
                    cursor: 'pointer'
                  }}
                  id='basic-column-dropdown'
                  aria-controls={ open ? 'basic-menu-column-dropdown' : undefined }
                  aria-haspopup="true"
                  aria-expanded={ open ? 'true' : undefined }
                  onClick={handleClick}
                  t
                />
              </Tooltip>

              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentPasteIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem>
                  <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* list card */}
          <Box sx={{
            p: '0 5px',
            m: '0 5px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: (theme) => `calc(${
              theme.trello.boardContentHeight} - 
              ${theme.spacing(5)} - 
              ${COLUMN_FOOTER_HEIGHT} - 
              ${COLUMN_HEADER_HEIGHT}
            )`,
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
            // "*" dung cho tất cả "&" dùng cho custom riêng
          }}>
            {/* List Card */}
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://image.phunuonline.com.vn/news/2019/20190824/fckimage/160327_1-1-231023216.jpg"
              />
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size="small" startIcon={<GroupIcon />}>20</Button>
                <Button size="small" startIcon={<CommentIcon />}>15</Button>
                <Button size="small" startIcon={<AttachmentIcon />}>10</Button>
              </CardActions>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

          </Box>
          {/* footer */}
          <Box sx={{
            height: COLUMN_FOOTER_HEIGHT,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Footer */}
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor : 'pointer' }} />
            </Tooltip>
          </Box>
        </Box>
        {/* COLUMN 2 */}
        <Box sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
          // (theme) = `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
          {/* header */}
          <Box sx={{
            height: COLUMN_HEADER_HEIGHT,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant='h6' sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Column Title
            </Typography>
            <Box>
              <Tooltip title = 'More options'>
                <ExpandMoreIcon
                  sx={{
                    color: 'text.primary',
                    cursor: 'pointer'
                  }}
                  id='basic-column-dropdown'
                  aria-controls={ open ? 'basic-menu-column-dropdown' : undefined }
                  aria-haspopup="true"
                  aria-expanded={ open ? 'true' : undefined }
                  onClick={handleClick}
                  t
                />
              </Tooltip>

              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentPasteIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem>
                  <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* list card */}
          <Box sx={{
            p: '0 5px',
            m: '0 5px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: (theme) => `calc(${
              theme.trello.boardContentHeight} - 
              ${theme.spacing(5)} - 
              ${COLUMN_FOOTER_HEIGHT} - 
              ${COLUMN_HEADER_HEIGHT}
            )`,
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
            // "*" dung cho tất cả "&" dùng cho custom riêng
          }}>
            {/* List Card */}
            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://image.phunuonline.com.vn/news/2019/20190824/fckimage/160327_1-1-231023216.jpg"
              />
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size="small" startIcon={<GroupIcon />}>20</Button>
                <Button size="small" startIcon={<CommentIcon />}>15</Button>
                <Button size="small" startIcon={<AttachmentIcon />}>10</Button>
              </CardActions>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              cursor: 'pointer',
              boxShadow: '0 1px 1px rgpa(0, 0, 0, 0.2)',
              overflow: 'unset'
            }}>
              <CardContent sx={{ px: 1.5, '&:last-child':{ p: 1.5 } }}>
                <Typography> IU hotel deluna </Typography>
              </CardContent>
            </Card>
          </Box>
          {/* footer */}
          <Box sx={{
            height: COLUMN_FOOTER_HEIGHT,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Footer */}
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor : 'pointer' }} />
            </Tooltip>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}

export default BoardContent