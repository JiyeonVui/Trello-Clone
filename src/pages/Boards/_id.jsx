import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
import { mockData } from '~/apis/mock-data'
function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // "Tam thời fix cứng boardId, flow chuẩn chỉnh về sau khi học khóa nâng cao sẽ dùng react-router-dom để lấy boardId từ url"
    // const boardId = '680884bfdc7451b44c512765'
    // call api
    // fetchBoardDetailsAPI(boardId).then((board) => {
    //   setBoard(board)
    // })

  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{
      height: '100vh'
    }}>
      <AppBar />
      <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
      {/* <VideoPlayer /> */}
    </Container>
  )
}

export default Board