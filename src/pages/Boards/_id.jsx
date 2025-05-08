
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import { toast } from 'react-toastify'
// import { mockData } from '~/apis/mock-data'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // "Tam thời fix cứng boardId, flow chuẩn chỉnh về sau khi học khóa nâng cao sẽ dùng react-router-dom để lấy boardId từ url"
    const boardId = '681c7468c5e7e4c12974fd8d'

    // call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach( column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
        else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })

  }, [] )

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    console.log('createdColumn', createdColumn)

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  // goi api khi keo tha column xong xuoi
  const moveColumns = ( dndOrderedColumns ) => {

    const dndOrderedColumnIds = dndOrderedColumns.map( c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(board)

    // goi API update Board
    updateBoardDetailsAPI(board._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }

    setBoard(newBoard)
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
    setBoard(board)

    let prevCardOderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    console.log('🚀 ~ moveCardToDifferentColumn ~ prevCardOderIds:', prevCardOderIds)

    if ( prevCardOderIds[0].includes('placeholder-card')) {
      console.log('Empty event')
      prevCardOderIds = []
    }

    // goi API update Board
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // console.log('createdCard', createdCard)
    // Cập nhật state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)

    if (columnToUpdate) {
      // neu column rong ban chan la dang chua placeholdercard can phai xoa di
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
      else {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
    }
    setBoard(newBoard)
  }

  // Xu ly xoa column va card ben trong no
  const deleteColumnDetails = ( columnId ) => {
    // update du lieu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter( _id => _id !== columnId)
    setBoard(newBoard)
    // goi api xu ly ben BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
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

        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
      {/* <VideoPlayer /> */}
    </Container>
  )
}

export default Board