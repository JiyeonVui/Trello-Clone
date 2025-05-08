import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLib/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
}) {

  // https://docs.dndkit.com/api-documentation/sensors
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const mySensors = useSensors(mouseSensor, touchSensor)


  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm video 37)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  // Tìm 1 cái column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(c => c?.cards?.map(card => card._id)?.includes(cardId))
  }
  // cap nhat lai state trong truong hop move card giua 2 column khac nhau => Function chung
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {

    setOrderedColumns(prevColumns => {
      // Tìm vị trí index của cái overcard trong column đích (nơi card sẽ thả vào)
      const overCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1
      // clone mảng columns để ko bị lỗi immutable
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumns = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumns = nextColumns.find(c => c._id === overColumn._id)
      // column cũ
      if (nextActiveColumns) {
        // Xoá card ở cái column active (cũ) đi
        nextActiveColumns.cards = nextActiveColumns.cards.filter(c => c._id !== activeDraggingCardId)
        // Thêm Placeholder card vào Column rỗng
        if (isEmpty(nextActiveColumns.cards)) {
          nextActiveColumns.cards = [generatePlaceholderCard(nextActiveColumns)]
        }
        // câp nhật lại mảng orderIds cho chuẩn dữ liệu
        nextActiveColumns.cardOrderIds = nextActiveColumns.cards.map(card => card._id)
      }
      // column mới
      if (nextOverColumns) {
        // Kiểm tra xem card đang kéo có nằm trong column đích ko, nếu có thì cần xóa nó đi
        nextOverColumns.cards = nextOverColumns.cards.filter(c => c._id !== activeDraggingCardId)

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumns._id
        }
        // Thêm card vào column đích và cập nhật lại mảng orderIds cho chuẩn dữ liệu
        nextOverColumns.cards = nextOverColumns.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xoá Placeholder card ở column đích nếu có
        nextOverColumns.cards = nextOverColumns.cards.filter(card => !card?.FE_PlaceholderCard) // Loc ra card ko phai la Placeholder card

        // cập nhật lại mảng orderIds cho chuẩn dữ liệu
        nextOverColumns.cardOrderIds = nextOverColumns.cards.map(card => card._id)
      }

      if (triggerFrom === 'handleDragEnd') {
        // xu ly goi api drag card giua 2 column
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumns._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || !active) return

    // xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // nếu ko tồn tại active với over (kéo linh tinh ra ngoài thì ko làm gì cả tránh crash Website)
      const { id: activeDraggingCardId, data: { current : activeDraggingCardData } } = active
      // over card
      const { id: overCardId } = over

      // Tìm 2 column theo card
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return
      // Hanh dong keo tha card giua 2 column khac nhau
      // phai dung toi activeDragItemData.columnId hoac activeDragItemData._id de lay columnId

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // hanh dong keo tha card trong cung 1 column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId) // lay vi tri cu tu active

        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId) // lay vi tri voi tu active
        // Dung arrayMove vi keo card trong 1 cai column tuong tu voi logic keo column trong board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)
        // console.log('dndOrderedCards', dndOrderedCards)
        // van goi update State o day de tranh delay hoac flickering giao dien luc keo tha

        setOrderedColumns(prevColumns => {
          const nextColumn = cloneDeep(prevColumns)
          // Tim toi column dang tha
          const targetColumn = nextColumn.find(column => column._id === overColumn._id)

          // cap nhat 2 gia tri moi la cards va cardOrderIds cho column
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds
          return nextColumn
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    // Xu ly keo tha column trong board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {

      if (active.id !== over.id) {

        const oldColIndex = orderedColumns.findIndex(c => c._id === active.id) // lay vi tri cu tu active
        const newColIndex = orderedColumns.findIndex(c => c._id === over.id) // lay vi tri voi tu active

        const dndOrderedColumns = arrayMove(orderedColumns, oldColIndex, newColIndex)

        moveColumns(dndOrderedColumns)
        // van goi update State o day de tranh delay or flickering giao dien
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Reset lại các giá trị sau khi kéo thả xong
    setActiveDragItemData(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setOldColumnWhenDraggingCard(null)
  }
  // trigger trong qua trinh keo mot item
  const handleDragOver = (event) => {
    // Ko lam gi thêm nếu keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Nếu là kéo card xử lý thêm đê keo card qua lại các column
    const { active, over } = event
    // nếu ko tồn tại active với over (kéo linh tinh ra ngoài thì ko làm gì cả tránh crash Website)
    if ( !active || !over) return
    // active card
    const { id: activeDraggingCardId, data: { current : activeDraggingCardData } } = active
    // over card
    const { id: overCardId } = over

    // Tìm 2 column theo card
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // console.log('activeColumn', activeColumn)
    // console.log('overColumn', overColumn)

    // Nếu ko tồn tại 1 trong 2 column thì ko làm gì cả để tránh crash website
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active.data.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active.data.current)

    // Nếu là kéo card thì cần lưu lại column cũ để xử lý sau này
    if (event?.active.data.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5
        }
      }
    })
  }
  // args = agruments doi so thong so tham so
  const collisionDetectionStrategy = useCallback((args) => {
    // console.log('handerDragOver')
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    // Tim cac diem giao nhau, diem va cham voi con tro
    const pointerIntersection = pointerWithin(args)

    if (!pointerIntersection?.length) return

    // Tim overId dau tien trong dam intersections o tren
    let overId = getFirstCollision(pointerIntersection, 'id')

    if (overId) {
      // fix flickering khi keo column
      // Nếu over nó là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán 
      // phát hiện va chạm closestCorners hoặc closestCenter đều đc.
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before', overId)
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          })[0]?.id
        })
        // console.log('overId after', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType])

  return (
    <DndContext
      sensors={mySensors}
      // collisionDetection={closestCorners}
      // custom nang cao thuat toan phat hien va va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        p: '10px 0'
      }}>
        <ListColumns
          columns= {orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />
        <DragOverlay
          dropAnimation={customDropAnimation}
        >
          {!activeDragItemData && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent