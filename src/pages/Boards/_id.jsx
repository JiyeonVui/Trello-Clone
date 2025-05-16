
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'

import { cloneDeep } from 'lodash'
import Box from '@mui/material/Box'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

import { useDispatch, useSelector } from 'react-redux'

// import { mockData } from '~/apis/mock-data'

function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  useEffect(() => {
    // "Tam thời fix cứng boardId, flow chuẩn chỉnh về sau khi học khóa nâng cao sẽ dùng react-router-dom để lấy boardId từ url"
    const boardId = '68234e2f33c25b73b16e0a2d'

    // call api
    dispatch(fetchBoardDetailsAPI(boardId))

  }, [dispatch])

  // goi api khi keo tha column xong xuoi
  const moveColumns = ( dndOrderedColumns ) => {

    const dndOrderedColumnIds = dndOrderedColumns.map( c => c._id)
    /**
     * Trường hợp dùng spread operator này thì lại không sao bởi vì ở đây chúng ta ko dùng push như ở trên làm
     * thay đổi tt kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị của columns và columnOrderIds ở 2 mảng
     * mới. Tương tự như việc dùng array.concat() để merge 2 mảng lại với nhau
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // goi API update Board
    updateBoardDetailsAPI(board._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state board
    /**
     * Cannot assign to read only property 'columns' of object '[object Object]'
     * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only - (nested object -
     * can thiệp sâu dữ liệu)
     */

    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }

    dispatch(updateCurrentActiveBoard(newBoard))
    //Goi Api cap nhat card order ids cua column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })

  }
  /**
   * Khi move card giữa 2 column khác nhau
   * 3 bước
   * Cập nhật lại orderIds và card của column đầu tiên chứa nó
   * Cập nhật lại mang CardOrderIds của column tiếp theo
   * Cập nhật lại trường ColumnId mới của cái card đã kéo
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    const dndOrderedColumnIds = dndOrderedColumns.map( c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // console.log('🚀 ~ moveCardToDifferentColumn ~ prevCardOderIds:', prevCardOrderIds)

    if ( prevCardOrderIds[0].includes('placeholder-card')) {
      // console.log('Empty event')
      prevCardOrderIds = []
    }
    // console.log('🚀 ~ moveCardToDifferentColumn ~ nextColumnId:', nextColumnId)
    // goi API update Board
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if ( !board ) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        {/* <CircularProgress /> */}
        {/* <Typography>Loading Board...</Typography> */}
        Loading...
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{
      height: '100vh'
    }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
      {/* <VideoPlayer /> */}
    </Container>
  )
}

export default Board