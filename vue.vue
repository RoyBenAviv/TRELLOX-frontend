<template>
  <div class="card-board">
    <Container orientation="horizontal" @drop="onGroupDrop($event)" drag-handle-selector=".group-drag-handle" @drag-start="dragStart" :drop-placeholder="upperDropPlaceholderOptions">
      <Draggable v-for="group in board.groups" :key="group.id">
        <div :class="group.props.className">
          <div class="card-group-header">
            <span class="group-drag-handle">&#x2630;</span>
            {{ group.name }}
          </div>
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(group.id, e)"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            :get-child-payload="getCardPayload(group.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="card in group.cards" :key="card.id">
              <div :class="card.props.className" :style="card.props.style">
                <p>{{ card.data }}</p>
              </div>
            </Draggable>
          </Container>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag, generateItems } from '../utils/helpers'
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
const groupNames = ['Lorem', 'Ipsum', 'Consectetur', 'Eiusmod']
const cardColors = ['azure', 'beige', 'bisque', 'blanchedalmond', 'burlywood', 'cornsilk', 'gainsboro', 'ghostwhite', 'ivory', 'khaki']
const pickColor = () => {
  const rand = Math.floor(Math.random() * 10)
  return cardColors[rand]
}
const board = {
  type: 'container',
  props: {
    orientation: 'horizontal',
  },
  groups: generateItems(4, (i) => ({
    id: `group${i}`,
    type: 'container',
    name: groupNames[i],
    props: {
      orientation: 'vertical',
      className: 'card-container',
    },
    cards: generateItems(+(Math.random() * 10).toFixed() + 5, (j) => ({
      type: 'draggable',
      id: `${i}${j}`,
      props: {
        className: 'card',
        style: { backgroundColor: pickColor() },
      },
      data: lorem.slice(0, Math.floor(Math.random() * 150) + 30),
    })),
  })),
}

export default {
  name: 'Cards',
  components: { Container, Draggable },
  data() {
    return {
      board,
      upperDropPlaceholderOptions: {
        className: 'cards-drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    }
  },
  methods: {
    onGroupDrop(dropResult) {
      const board = Object.assign({}, this.board)
      board.groups = applyDrag(board.groups, dropResult)
      this.board = board
    },
    onCardDrop(groupId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const board = Object.assign({}, this.board)
        const group = board.groups.filter((p) => p.id === groupId)[0]
        const groupIndex = board.groups.indexOf(group)
        const newGroup = Object.assign({}, group)
        newGroup.groups = applyDrag(newGroup.groups, dropResult)
        board.groups.splice(groupIndex, 1, newGroup)
        this.board = board
      }
    },
    getCardPayload(groupId) {
      return (index) => {
        return this.board.groups.filter((p) => p.id === groupId)[0].cards[index]
      }
    },
    dragStart() {
      console.log('drag started')
    },
    log(...params) {
      console.log(...params)
    },
  },
}
</script>
