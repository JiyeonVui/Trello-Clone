
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import {
  createNewColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns }) {
  /**
   * SortableContext yêu cầu items là một mảng dạng ['id-1', 'id-2'] chứ ko phải
   * [{id: 'id-1'}, {id: 'id-2'}]
   * Nếu không đúng thì vẫn kéo thả đc nhưng ko có animation
   * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
   */
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumntTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumntTitle) {
      toast.error('Please enter Column title!')
      return
    }
    // Tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumntTitle
    }

    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    /**
     * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra 1 newBoard nhưng bản chất
     * của spread operator là shallow copy, nên dính phải rules immutable của redux tookit ko dùng được
     * hàm push() (sửa giá trị trực tiếp vào object), cách đơn giản nhanh gọn nhất là dùng Deep copy toàn
     * bộ cái Board cho dễ hiểu và code ngăn gọn hơn
     */


    // Cập nhật state board
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /**
     * có 1 cách khác là dùng array.concat() để thay cho hàm push() => nó sẽ tạo ra 1 mảng mới bằng cách merge 2 mảng lại với nhau.
     */

    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái thêm Column mới & Clear Input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    <SortableContext items={columns?.map( c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {columns?.map(( column ) => {
          return (
            <Column
              key={column._id}
              column={column}
            />
          )
        })}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
                Add new Column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              id="outlined-search"
              label="Search field"
              type="text"
              size='small'
              autoFocus
              value={newColumntTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                minWidth: '120px',
                maxWidth: '180px',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Button
                onClick={addNewColumn}
                variant = 'contained' color = 'success' size = 'small'
                sx = {{
                  boxshadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover' : { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover' : { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
