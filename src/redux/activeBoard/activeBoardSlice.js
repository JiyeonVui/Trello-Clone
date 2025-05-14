import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// khoi tao giai tri state cua 1 slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bất đông bộ) và cập nhật dữ liệu vào redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk#usage
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Khoi tao mot cai slice trong kho luu tru - redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // noi xu ly du lieu dong bo
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chung ta gán nó 1 biến có nghĩa hơn

      const board = action.payload

      // xử lý dữ liệu nếu cần thiết

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // extraReducers: Nơi xử lý các hành động bất đồng bộ (async) như gọi API
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload là response.data từ API trả về
      const board = action.payload

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

      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// selectors: Là nơi dành cho các components bên dưới gọi bằng hooks useSelector để lấy dữ liệu từ redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// Cái file này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer, Lưu ý nhé

// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer