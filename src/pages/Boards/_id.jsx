import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BoardBar from '~/pages/Boards/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // "Tam thời fix cứng boardId, flow chuẩn chỉnh về sau khi học khóa nâng cao sẽ dùng react-router-dom để lấy boardId từ url"
    const boardId = '68076aedebfa334f1976ac09'
    // call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{
      height: '100vh'
    }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
      {/* <VideoPlayer /> */}
    </Container>
  )
}

export default Board