<template>
  <section v-if="card" class="card-edit">
    <div @mousedown="closeEdit" class="window-overlay">
      <div @mousedown.stop class="card-modal">
        <div class="card-modal-details">
          <i @click="closeEdit" class="fa-solid fa-xmark close-modal-button"></i>
          <div class="modal-header">
            <span class="modal-header-icon">
              <i class="fa-solid fa-tachograph-digital"></i>
            </span>
            <div class="modal-header-title">
              <textarea v-model="card.title" @keyup="updateCard" dir="auto" data-autosize="true"></textarea>
            </div>
            <div class="inline-content">in list {{ groupId }}</div>
          </div>
          <div class="modal-main-content">
            <div class="card-details">
              <div v-if="members.length" class="card-details-item">
                <h3>Members</h3>
                <div class="member" v-for="member in members" :key="member.id" :title="member.fullname">
                  <img src="https://trello.com/1/cards/62399dba78ab2987b393bef4/attachments/6239ba94c62cb36ebd4d3023/previews/6239ba95c62cb36ebd4d3042/download/T02L3AYJGN4-U02RAGA3ZJP-0b63d8a04626-512.png" alt="" />
                </div>
                <div class="add-member" @click="openModal('member-picker')"><i class="fa-solid fa-plus"></i></div>
              </div>

              <div v-if="labels.length" class="card-details-item">
                <h3>Labels</h3>
                <div>
                  <span class="label-span" v-for="label in labels" :key="label.id" :class="label.className" :title="label.title">
                    <span @click="openModal('label-picker')">{{ label.title }}</span>
                  </span>
                  <div class="add-label" @click="openModal('label-picker')"><i class="fa-solid fa-plus"></i></div>
                </div>
              </div>
            </div>
            <div class="description-container">
              <div class="title">
                <span>
                  <i class="fa-solid fa-align-left"></i>
                </span>
                <h3>Description</h3>
              </div>
              <div class="description-input">
                <pre v-if="!isTextArea && card.description.length" @click="isTextArea = true">{{ card.description }}</pre>
                <div v-if="!isTextArea && !card.description" class="fake-text-area" @click="isTextArea = true">
                  <p>Add a more detailed description…</p>
                </div>
                <div v-click-outside="() => (isTextArea = false)" v-if="isTextArea">
                  <textarea v-focus v-model="description" placeholder="Add a more detailed description…"></textarea>
                  <button @click="updateDescription" class="save-btn">Save</button>
                  <span @click="isTextArea = false" class="x-icon"><i class="fa-solid fa-xmark"></i></span>
                </div>
              </div>
            </div>
            <div v-for="checklist in card.checklists" :key="checklist.id" class="checklist-container">
              <div class="title">
                <span style="top: 7px">
                  <i class="fa-solid fa-list-check"></i>
                </span>
                <h3>{{ checklist.title }}</h3>
                <button class="grey-btn">Delete</button>
              </div>
              <div class="checklist-progress">
                <span class="progress-precent">{{ calcProgress(checklist.todos) }}</span>
                <div class="progress-bar">
                  <div :style="'width:' + calcProgress(checklist.todos)" :class="calcProgress(checklist.todos) === '100%' ? 'progress-completed' : ''" class="current-progress"></div>
                </div>
              </div>
              <div>
                <div v-for="todo in checklist.todos" :key="todo.id" class="checklist-todos-container">
                  <div @click="toggleTodo(todo.id, checklist.id)" class="todo-checkbox" :class="todo.isDone ? 'completed' : ''"><span :class="todo.isDone ? 'checked' : ''"></span></div>
                  <div class="todo-title-container" :class="todo.isDone ? 'todo-completed' : ''">
                    <div class="todo-title">{{ todo.title }}</div>
                  </div>
                </div>
              </div>
              <div v-click-outside="() => (isAddTodo = null)" class="add-todo-container">
                <textarea v-if="isAddTodo === checklist.id" v-model="checklist.newTodo" v-focus @keydown.prevent.enter="addTodo(checklist.id, checklist)" placeholder="Add an item" :hidden="!isAddTodo"></textarea>
                <button v-if="isAddTodo === checklist.id" :class="checklist.newTodo ? 'save-btn' : 'not-allowed-btn'"  @click.stop="addTodo(checklist.id, checklist)">Add</button>
                <button v-else class="grey-btn" @click.stop="isAddTodo = checklist.id" style="margin: unset">Add an item</button>
                  <span v-if="isAddTodo === checklist.id && checklist.newTodo" @click="closeTodoInput(checklist)" class="x-icon"><i class="fa-solid fa-xmark"></i></span>
              </div>
            </div>
            <div class="activity-container">
              <div class="title">
                <span style="top: 7px">
                  <i class="fa-solid fa-list-ul"></i>
                </span>
                <h3>Activity</h3>
                <button v-if="isShowActivity" @click="showActivity" class="grey-btn">Hide details</button>
                <button v-else @click="showActivity" class="grey-btn">Show details</button>
              </div>
              <div class="comments-frame">
                <div class="comments-input" v-click-outside="() => (isCommentsInput = false)">
                  <textarea @focus="isCommentsInput = true" @keydown.prevent.enter="postComment" :class="commentsInputStyle" v-model="newComment.txt" placeholder="Write a comment..."></textarea>
                  <button v-if="isCommentsInput" @click.stop="postComment" :class="isCommentsText">Save</button>
                </div>
              </div>
            </div>
            <div>
              <div class="card-comment-container" v-for="comment in card.comments" :key="comment.id">
                <div class="member">
                  <!-- <img :src="getMemberById(comment.byMember).imgUrl"> -->
                  <img src="https://trello.com/1/cards/62399dba78ab2987b393bef4/attachments/6239ba94c62cb36ebd4d3023/previews/6239ba95c62cb36ebd4d3042/download/T02L3AYJGN4-U02RAGA3ZJP-0b63d8a04626-512.png" alt="" />
                </div>
                <div class="card-comment">
                  <!-- <span class="comment-by">{{getMemberById().fullname}}</span> -->
                  <span class="comment-by">Tamiros </span>
                  <span class="comment-date">{{ comment.createdAt }}</span>
                  <div class="the-comment">{{ comment.txt }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-side-bar">
            <div class="action-container">
              <h3>Suggested</h3>
              <div @click="joinToCard" class="action-btn">
                <span><i class="fa-solid fa-user"></i></span>
                <span>Join</span>
              </div>
            </div>
            <div class="action-container">
              <h3>Add to card</h3>
              <div class="action-btn" @click="openModal('member-picker')">
                <span><i class="fa-solid fa-user"></i></span>
                <span>Members</span>
              </div>
              <div class="action-btn" @click="openModal('label-picker')">
                <span><i class="fa-solid fa-tags"></i></span>
                <span>Labels</span>
              </div>
              <component v-if="cmpName" :is="cmpName" :card="card"
              @closeModal="closeModal" @updateKey="updateKey"></component>
              <div class="action-btn" @click="openModal('checklist-add')">
                <span><i class="fa-solid fa-list-check"></i></span>
                <span>Checklist</span>
              </div>
              <div class="action-btn">
                <span><i class="fa-solid fa-clock"></i></span>
                <span>Dates</span>
              </div>
              <div class="action-btn">
                <span><i class="fa-solid fa-paperclip"></i></span>
                <span>Attachment</span>
              </div>
              <div class="action-btn" @click="openModal('cover-picker')">>
                <span><i class="fa-solid fa-fill-drip"></i></span>
                <span>Cover</span>
              </div>
              <!-- <div class="action-btn">
                            <span><i class="fa-solid fa-user"></i></span>
                            <span>Custom Fields</span>
                            </div> -->
            </div>
            <div class="action-container">
              <h3>Actions</h3>
              <div class="action-btn">
                <span><i class="fa-solid fa-arrow-right"></i></span>
                <span>Move</span>
              </div>
              <div class="action-btn">
                <span><i class="fa-solid fa-copy"></i></span>
                <span>Copy</span>
              </div>
              <div class="action-btn">
                <span><i class="fa-solid fa-file-export"></i></span>
                <span>Make template</span>
              </div>
              <div class="action-btn">
                <span><i class="fa-solid fa-eye"></i></span>
                <span>Watch</span>
              </div>
              <hr />
              <div class="action-btn">
                <span><i class="fa-solid fa-box-archive"></i></span>
                <span>Archive</span>
              </div>
              <div class="action-btn">
                <span><i class="fa-solid fa-share-nodes"></i></span>
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { utilService } from '../../services/util.service.js'
import labelPicker from './label-picker.vue'
import memberPicker from './member-picker.vue'
import checklistAdd from './checklist-add.vue'
import coverPicker from './cover-picker.vue'

export default {
  components: {
    labelPicker,
    memberPicker,
    checklistAdd,
    coverPicker
  },
  data() {
    return {
      isTextArea: false,
      card: null,
      boardId: null,
      cardId: null,
      groupId: null,
      isShowActivity: false,
      isCommentsInput: false,
      newComment: {
        id: null,
        txt: '',
        createdAt: null,
        byMember: 'me', //loggedInUser
      },
      cmpName: null,
      description: null,
      isAddTodo: null,
      newTodo: {
        title: '',
        isDone: false,
      },
    }
  },
  created() {
    this.cardId = this.$route.params.cardId
    this.boardId = this.$route.params.boardId
    this.loadCard()
  },
  methods: {
    openModal(cmpName) {
      this.cmpName = cmpName
    },
    closeModal() {
      this.cmpName = null
    },
    updateKey(key, value) {
      console.log('updateKey: value',value)
      if (key === 'checklists') {
        value.id = utilService.makeId()
        this.card[key].push(value)
      } else this.card[key] = value
      this.updateCard()
    },
    closeEdit() {
      this.$router.push(`/board/${this.boardId}`)
    },
    async loadCard() {
      const cardDetails = await this.$store.dispatch({ type: 'getCardById', boardId: this.boardId, cardId: this.cardId })
      this.card = cardDetails.card
      this.description = cardDetails.card?.description || ''
      this.groupId = cardDetails.groupId
    },
    showActivity() {
      this.isShowActivity = !this.isShowActivity
    },
    toggleCommentsInput() {
      this.isCommentsInput = !this.isCommentsInput
    },
    postComment() {
      console.log('here')
      if (!this.newComment.txt) return
      var comment = JSON.parse(JSON.stringify(this.newComment))
      comment.createdAt = Date.now()
      this.card.comments.push(comment)
      this.updateCard()
      this.newComment.txt = ''
    },
    openModal(cmpName) {
      this.cmpName = cmpName
    },
    async updateCard() {
      await this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card: this.card })
      this.loadCard()
    },
    calcProgress(todos) {
      if (!todos.length) return '0%'
      const doneTodos = todos.reduce((acc, todo) => {
        if (todo.isDone) acc++
        return acc
      }, 0)
      var precent = ((doneTodos * 100) / todos.length).toFixed(0) + '%'
      return precent
    },
    toggleTodo(todoId, checklistId) {
      const clIdx = this.card.checklists.findIndex((cl) => cl.id === checklistId)
      console.log('clIdx', clIdx)
      console.log('checklistId', checklistId)
      const todoIdx = this.card.checklists[clIdx].todos.findIndex((t) => t.id === todoId)
      this.card.checklists[clIdx].todos[todoIdx].isDone = !this.card.checklists[clIdx].todos[todoIdx].isDone
      this.updateCard()
    },
    updateDescription() {
      this.card.description = this.description
      this.updateCard()
      this.isTextArea = false
    },
    getMemberById(memberId) {
      console.log('memberId', memberId)
    },
    addTodo(checklistId, checklist) {
      var newTodo = JSON.parse(JSON.stringify(this.newTodo))
      newTodo.title = JSON.parse(JSON.stringify(checklist.newTodo))
      checklist.newTodo = ''
      if(!newTodo.title) return
      newTodo.id = utilService.makeId()
      const idx = this.card.checklists.findIndex((cl) => cl.id === checklistId)
      this.card.checklists[idx].todos.push(newTodo)
      this.updateCard()
      
    },
    closeTodoInput(checklist) {
      checklist.newTodo = ''
      this.isAddTodo = null
    },
  },
  computed: {
    commentsInputStyle() {
      return this.isCommentsInput ? 'active-input' : ''
    },
    isCommentsText() {
      return this.newComment.txt ? 'save-btn' : 'not-allowed-btn'
    },
    labels() {
      var labels = this.$store.getters.currBoard.labels
      return labels.filter((l) => this.card.labelIds.includes(l.id))
    },
    members() {
      var members = this.$store.getters.currBoard.members
      return members.filter((m) => this.card.memberIds.includes(m._id))
    },
  },
}
</script>

<style></style>
