<template>
  <section>
    <div @click.stop="openCardEdit" @mousedown="stopDrag($event)" class="card-preview" :style="computedStyle" :class="computedQuickEdit" @mouseover="isDragOver = true" @mouseleave="isDragOver = false">
      <Container
        v-if="card.stickers?.length || (this.$store.getters.isStickerDrag && isDragOver)"
        orientation="horizontal"
        group-name="5"
        @drop="onStickerDrop($event)"
        :class="card.stickers?.length ? 'sticker-container' : 'sticker-container-closed'"
      >
        <div class="sticker" v-for="(sticker, idx) in card.stickers" :key="sticker" @click.stop="removeSticker(idx)">
          <img :src="sticker" alt="" />
        </div>
      </Container>
      <div
        v-if="card.style.fullCover && !checkQuickEdit"
        :style="card.style.type === 'color' ? `background: ${card.style.cover}` : `background-image: url('${card.style.cover}')`"
        class="card-preview-full-cover"
        :class="card.style.type === 'color' ? '' : 'imgUrl'"
      >
        <div class="card-preview-cover-color"></div>
        <div class="full-cover-title" :class="card.style.isDark ? 'dark' : 'light'">
          <span>{{ card.title }}</span>
        </div>
        <span @click.stop="openQuickEdit" class="edit-card"></span>
      </div>
      <div v-else class="card-preview-inside-container">
        <div v-if="card.style.cover" class="card-preview-cover">
          <img class="card-image" v-if="card.style.type === 'url'" :src="card.style.cover" />
          <div v-else class="card-preview-cover-color" :style="`background-color: ${card.style.cover};`"></div>
        </div>
        <img class="card-image" v-if="card.attachments.length && !card.style.cover && card.attachments[0].format !== 'mp4'" :src="card.attachments[0].url" />
        <!-- {{card.attachments}} -->
        <video-player v-if="card.attachments.length && !card.style.cover && card.attachments[0].format == 'mp4'" @click.stop class="card-video" :options="videoOptions(card.attachments[0].url)" />
        <div :style="(card.style.type === 'url' && !card.style.fullCover) || (card.attachments.length && !card.style.cover && !card.style.fullCover) ? 'margin-top: unset' : ''" class="card-label-container">
          <span v-for="label in labels" :key="label.id" @click.stop="toggleLabelTitle" :class="[label.className, labelTitleShown]" class="card-label" :title="label.title">
            <span v-if="labelTitleShown">{{ label.title }}</span>
          </span>
        </div>
        <br v-if="checkQuickEdit && labels.length" />
        <span @click.stop="openQuickEdit($event)" class="edit-card"></span>
        <textarea v-if="checkQuickEdit" :style="labels.length ? 'transform: translateY(-9px)' : 'transform: translateY(3px);'" v-model="newTitle" v-focus @focus="$event.target.select()" @keydown.prevent.enter="updateTitle"></textarea>
        <span v-else class="card-preview-title">{{ card.title }}</span>
        <div class="card-icons-container">
          <div>
            <div v-if="checkUser" title="watch" class="icon-div">
              <span class="eyecon"></span>
            </div>
            <div :class="{ complete: card.dueDate?.isCompleted }" title="date" v-if="card.dueDate" class="icon-div date-preview" @click.stop="completeDate">
              <span v-if="card.dueDate.isCompleted" class="date-complete-icon"></span>
              <span v-else class="date-icon"></span>
              <span class="date">{{ formattedDate }}</span>
            </div>
            <div title="description" v-if="card.description" class="icon-div">
              <span class="desc"></span>
            </div>
            <div title="comments" v-if="card.comments.length" class="icon-div">
              <span class="comment"></span>
              <span class="txt">{{ card.comments.length }}</span>
            </div>
            <div title="attachments" v-if="card.attachments.length" class="icon-div">
              <span class="attachment"></span>
              <span class="txt">{{ card.attachments.length }}</span>
            </div>
            <div title="Checklist items" v-if="card.checklists.length" class="icon-div" :class="doneChecklist">
              <span class="check"></span>
              <span class="txt">{{ calcProgress() }}</span>
            </div>
            <Container v-if="members.length || (this.$store.getters.isMemberDrag && isDragOver)" style="float: right" group-name="3" orientation="horizontal" :get-child-payload="getChildPayload" @drop="onMemberDrop($event)">
              <Draggable style="height: 28px" class="avatar-container" @mousedown="this.$store.commit({ type: 'memberDrag', isDrag: true })" v-for="member in members" :key="member.id" :title="member.fullname">
                <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
                <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
              </Draggable>
            </Container>
          </div>
        </div>
        <button v-if="checkQuickEdit" class="save-quick-edit" @click.stop="updateTitle">Save</button>
        <quick-edit-actions @mousedown.stop @openCard="openCard" @openModal="openModal" :hidden="!checkQuickEdit" :class="checkQuickEdit ? 'fade-in' : ''"></quick-edit-actions>
        <component v-if="cmpName && checkQuickEdit" :isCopyCard="isCopyCard" :card="card" :is="cmpName" @removeCard="removeCard" @closeModal="closeModal" @updateKey="updateKey" v-click-outside="() => closeModal()" />
      </div>
    </div>
  </section>
</template>

<script>
import cardEdit from './card-edit.vue'
import quickEditActions from './quick-edit-actions.vue'
import labelPicker from './label-picker.vue'
import memberPicker from './member-picker.vue'
import coverPicker from './cover-picker.vue'
import datePicker from './date-picker.vue'
import confirmDelete from './confirm-delete.vue'
import moveCard from './move-card.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import videoPlayer from './video-player.vue'

export default {
  name: 'card-preview',
  props: {
    cardToCopy: Object,
    isQuickEdit: Object,
    groupId: String,
  },
  components: {
    cardEdit,
    quickEditActions,
    labelPicker,
    memberPicker,
    coverPicker,
    datePicker,
    confirmDelete,
    moveCard,
    Container,
    Draggable,
    videoPlayer,
  },
  data() {
    return {
      card: JSON.parse(JSON.stringify(this.cardToCopy)),
      activeColor: 'red',
      isChecklistDone: false,
      newTitle: '',
      cmpName: null,
      isCopyCard: false,
      posTop: null,
      posLeft: null,
      isDragOver: false,
      lastCard: null,
    }
  },
  methods: {
    openCard() {
      this.$emit('closeQuickEdit')
    },
    openCardEdit() {
      if (this.isQuickEdit.boolean) return
      const currRoute = this.$router.currentRoute._value.fullPath
      this.$router.push(`${currRoute}/edit/${this.card.id}`)
    },
    toggleLabelTitle() {
      this.$store.commit({ type: 'toggleLabelTitle' })
    },
    calcProgress() {
      const todosMap = this.card.checklists.reduce(
        (acc, cl) => {
          const doneTodos = cl.todos.reduce((acc, todo) => {
            if (todo.isDone) acc++
            return acc
          }, 0)
          acc.todosCount += cl.todos.length
          acc.doneTodos += doneTodos
          return acc
        },
        { todosCount: 0, doneTodos: 0 }
      )
      if (todosMap.todosCount === todosMap.doneTodos) this.isChecklistDone = true
      else this.isChecklistDone = false
      return `${todosMap.doneTodos}/${todosMap.todosCount}`
    },
    openQuickEdit(ev) {
      this.calcPosition(ev.target.getBoundingClientRect())
      this.newTitle = JSON.parse(JSON.stringify(this.card.title))
      this.$emit('openQuickEdit', this.card.id)
    },
    async updateTitle() {
      try {
        if (!this.newTitle) return
        const card = JSON.parse(JSON.stringify(this.card))
        this.lastCard = JSON.parse(JSON.stringify(this.card))
        card.title = this.newTitle
        this.card = card
        await this.addActivity(`updated this card title`)
        this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
        this.$emit('closeQuickEdit')
      } catch (err) {
        console.log('err', err)
        this.card = this.lastCard
        throw err
      }
    },
    openModal(cmpName) {
      if (cmpName === 'copy-card') {
        this.isCopyCard = true
        cmpName = 'move-card'
      } else this.isCopyCard = false
      this.cmpName = cmpName
    },
    calcPosition(rect) {
      var { left, top } = rect
      const winWidth = screen.width
      const winHeight = window.innerHeight
      if (top + 320 > winHeight) top = winHeight - 320
      left -= 217
      if (left + 420 > winWidth) left = winWidth - 420
      this.posTop = top
      this.posLeft = left
    },
    closeModal() {
      this.cmpName = null
    },
    async updateKey(key, value, activity) {
      try {
        const card = JSON.parse(JSON.stringify(this.card))
        this.lastCard = JSON.parse(JSON.stringify(this.card))
        if (key === 'checklists') {
          value.id = utilService.makeId()
          card[key].push(value)
        } else card[key] = value
        this.card = card
        if (activity) await this.addActivity(activity)
        this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
      } catch (err) {
        console.log('err', err)
        this.card = this.lastCard
        throw err
      }
    },
    async removeCard() {
      await this.addActivity(`removed card ${this.card.title}`)
      await this.$store.dispatch('removeCard', { groupId: this.groupId, cardId: this.card.id })
      this.$emit('closeQuickEdit')
    },
    async completeDate() {
      try {
        const card = JSON.parse(JSON.stringify(this.card))
        this.lastCard = JSON.parse(JSON.stringify(this.card))
        card.dueDate.isCompleted = !card.dueDate.isCompleted
        this.card = card
        if (card.dueDate?.isCompleted) await this.addActivity('marked the due date complete')
        else await this.addActivity('marked the due date incomplete')
        this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
      } catch (err) {
        console.log('err', err)
        this.card = this.lastCard
        throw err
      }
    },
    async addActivity(txt) {
      await this.$store.dispatch({ type: 'addActivity', txt, card: this.card })
    },
    async onMemberDrop(dropResult) {
      try {
        const card = JSON.parse(JSON.stringify(this.card))
        this.lastCard = JSON.parse(JSON.stringify(this.card))
        if (dropResult.addedIndex !== null && !card.memberIds.includes(dropResult.payload._id)) {
          card.memberIds.unshift(dropResult.payload._id)
          this.card = card
          await this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
        } else if (dropResult.removedIndex !== null) {
          const idx = card.memberIds.findIndex((mId) => mId === dropResult.payload._id)
          card.memberIds.splice(idx, 1)
          this.card = card
          await this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
        }
        this.$store.commit({ type: 'memberDrag', isDrag: false })
      } catch (err) {
        console.log('err', err)
        this.card = this.lastCard
        throw err
      }
    },
    getChildPayload(idx) {
      return this.members[idx]
    },
    onStickerDrop(dropResult) {
      try {
        const sticker = dropResult.payload.images.original_still.url
        const card = JSON.parse(JSON.stringify(this.card))
        this.lastCard = JSON.parse(JSON.stringify(this.card))
        if (dropResult.addedIndex !== null) {
          if (!card.stickers) card.stickers = []
          card.stickers.push(sticker)
          this.card = card
          this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
        }
        this.$store.commit({ type: 'stickerDrag', isDrag: false })
      } catch (err) {
        console.log('err', err)
        this.card = this.lastCard
        throw err
      }
    },
    removeSticker(idx) {
      const card = JSON.parse(JSON.stringify(this.card))
      card.stickers.splice(idx, 1)
      this.card = card
      this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
    },
    stopDrag(ev) {
      if (this.checkQuickEdit) ev.stopPropagation()
    },
    videoOptions(url) {
      return {
        autoplay: false,
        controls: true,
        sources: [
          {
            src: url,
            type: 'video/mp4',
          },
          {
            src: url,
            type: 'video/webm',
          },
        ],
      }
    },
  },
  computed: {
    labels() {
      var labels = this.$store.getters.currBoard.labels
      labels = labels.filter(({ className }) => className !== 'color10')
      return labels.filter((l) => this.card.labelIds.includes(l.id))
    },
    labelTitleShown() {
      return this.$store.getters.labelTitleShown ? 'open' : ''
    },
    doneChecklist() {
      return this.isChecklistDone ? 'completed' : ''
    },
    computedQuickEdit() {
      return this.isQuickEdit.boolean && this.isQuickEdit.cardId === this.card.id ? 'quick-card-editor-open' : ''
    },
    checkQuickEdit() {
      return this.isQuickEdit.boolean && this.isQuickEdit.cardId === this.card.id
    },
    members() {
      var members = this.$store.getters.currBoard.members
      return members.filter((m) => this.card.memberIds.includes(m._id))
    },
    formattedDate() {
      const date = new Date(this.card.dueDate?.date)
      const month = date.toLocaleString('en-US', { month: 'short' })
      const day = date.getDate()
      return `${month} ${day}`
    },
    checkUser() {
      return this.card.memberIds.includes(this.$store.getters.loggedinUser?._id)
    },
    computedStyle() {
      var style = (this.card.style.fullCover && this.card.style.type === 'url') || this.computedQuickEdit ? 'overflow-y: unset' : ''
      style += ';'
      style += this.checkQuickEdit ? `top: ${this.posTop}px; left: ${this.posLeft}px;` : ''
      return style
    },
  },
  watch: {
    cardToCopy: {
      handler() {
        this.card = this.cardToCopy
      },
      deep: true,
    },
  },
}
</script>
