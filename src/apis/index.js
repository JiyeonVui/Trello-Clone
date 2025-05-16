import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Lưu ý: Đối với việc sử dụng axios ở khóa MERN STACK PRO
 * Tất cả các function bên dưới các bạn sẽ thấy mình chỉ request và lấy data luôn mà ko có try catch hay then catch gì để bắt lỗi
 * Lý do là vì ở phía Front-end chúng ta ko cần thiết phải làm như vậy đối với mọi request bởi nó sẽ gây ra việc dư thừa code catch lỗi
 * quá nhiều.
 * Giải pháp Clean code đó là chúng ta sẽ tập trung catch lỗi tập trung ở 1 nới bằng cách tận dụng 1 thứ cực kỳ mạnh mẽ trong axios đó là Interceptor
 * Hiểu đơn giản Interceptor là cách mà chúng ta đánh chặn giữa request hoặc response để xử lý logic mà chúng ta muốn.
 * Sẽ có ở Mern Stack advanced khóa học sau.
 */
/** Boards */
// Đã move vào redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   // console.log('response', response.data)
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // console.log('response', response.data)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)
  // console.log('response', response.data)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  // console.log('response', response.data)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  // console.log('response', response.data)
  return response.data
}


/** Columns */
export const createNewColumnAPI = async ( newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

/** Cards */
export const createNewCardAPI = async ( newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newColumnData)
  return response.data
}