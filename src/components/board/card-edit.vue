<template>
  <section v-if="card" class="card-edit">
    <div @mousedown="closeEdit" class="window-overlay">
      <div @mousedown.stop class="card-modal">
        <div class="card-modal-details">
          <div v-if="card.style.cover" :style="cover" :class="coverType"></div>
          <span @click="closeEdit" class="close-modal-button" :class="coverButtonClass"></span>
          <div class="modal-header">
            <span class="modal-header-icon"> </span>
            <div class="modal-header-title">
              <textarea placeholder="Enter card title" v-model="card.title" @blur="updateTitle" @keydown.enter.prevent="updateTitle" dir="auto" data-autosize="true"></textarea>
            </div>
            <div class="inline-content">
              in list <span style="text-decoration: underline">{{ groupTitle }}</span>
            </div>
          </div>
          <div class="modal-main-content">
            <div class="card-details">
              <div v-if="members.length" class="card-details-item">
                <h3>Members</h3>
                <div class="avatar-container" v-for="member in members" :key="member.id" :title="member.fullname">
                  <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
                  <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
                </div>
                <div class="add-member" @click="openModal('member-picker', $event)"><i class="fa-solid fa-plus"></i></div>
              </div>
              <div v-if="labels.length" class="card-details-item">
                <h3>Labels</h3>
                <div>
                  <span class="label-span" v-for="label in labels" :key="label.id" :class="label.className" :title="label.title">
                    <span @click="openModal('label-picker', $event)">{{ label.title }}</span>
                  </span>
                  <div class="add-label" @click="openModal('label-picker', $event)"><i class="fa-solid fa-plus"></i></div>
                </div>
              </div>
              <div v-if="card.dueDate?.date" class="card-details-item card-date">
                <h3>Due date</h3>
                <input @input="updateCard" v-model="card.dueDate.isCompleted" type="checkbox" :class="{ full: card.dueDate.isCompleted }" />
                <span class="date-info" @click="openModal('date-picker', $event)">{{ formattedDate }}<span class="complete" v-if="card.dueDate.isCompleted">complete</span><i class="fa-solid fa-angle-down"></i></span>
              </div>
            </div>
            <div class="description-container">
              <div class="title">
                <span class="icon-description"> </span>
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
            <div v-if="card.attachments.length" class="attachments-container">
              <div class="title">
                <span class="icon-attachment"></span>
                <h3>Attachments</h3>
              </div>
              <ul>
                <li v-for="attachment in card.attachments" :key="attachment">
                  <video-player v-if="attachment.format === 'mp4'" :options="videoOptions(attachment.url)" />
                  <div v-else class="attachment" :style="{ 'background-image': 'url(' + attachment.url + ')' }"></div>
                  <div class="attachment-info">
                    <h5>{{ attachment.name }}.{{ attachment.format }} <span @click="openUrl(attachment.url)"></span></h5>
                    <p>Added {{ attachment.createdAt }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div v-for="(checklist, idx) in card.checklists" :key="checklist.id" class="checklist-container">
              <div class="title">
                <span style="top: 7px" class="icon-checklist"></span>
                <h3>{{ checklist.title }}</h3>
                <button @click="removeChecklist(idx)" class="grey-btn">Delete</button>
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
                <button v-if="isAddTodo === checklist.id" :class="checklist.newTodo ? 'save-btn' : 'not-allowed-btn'" @click.stop="addTodo(checklist.id, checklist)">Add</button>
                <button v-else class="grey-btn" @click.stop="isAddTodo = checklist.id" style="margin: unset">Add an item</button>
                <span v-if="isAddTodo === checklist.id && checklist.newTodo" @click="closeTodoInput(checklist)" class="x-icon"><i class="fa-solid fa-xmark"></i></span>
              </div>
            </div>
            <div class="activity-container">
              <div class="title">
                <span style="top: 7px" class="icon-activity"></span>
                <h3>Activity</h3>
                <button v-if="isShowActivity" @click="showActivity" class="grey-btn">Hide details</button>
                <button v-else @click="showActivity" class="grey-btn">Show details</button>
              </div>
              <div class="comments-frame">
                <div class="comments-input" v-click-outside="() => (isCommentsInput = false)">
                  <textarea @focus="isCommentsInput = true" :class="commentsInputStyle" v-model="newComment.txt" @keydown.enter.prevent="postComment" placeholder="Write a comment..."></textarea>
                  <button v-if="isCommentsInput" @click.stop="postComment" :class="isCommentsText">Save</button>
                </div>
              </div>
            </div>
            <div>
              <div class="card-comment-container" v-for="comment in comments" :key="comment.id">
                <div class="avatar-container member">
                  <img v-if="comment.byMember?.imgUrl" :src="comment.byMember.imgUrl" alt="" />
                  <span v-else>{{ comment.byMember?._id ? comment.byMember.fullname.split(' ')[0].split('')[0] + comment.byMember.fullname.split(' ')[1].split('')[0] : 'G' }}</span>
                </div>
                <div class="card-comment">
                  <span class="comment-by">{{ comment.byMember?.fullname || 'Guest' }}</span>
                  <span class="comment-date">{{ formattedTime(comment.createdAt) }}</span>
                  <div class="the-comment">
                    <p>{{ comment.txt }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activities.length && isShowActivity">
              <div class="card-comment-container" v-for="activity in activities" :key="activity.id">
                <div class="avatar-container member">
                  <img v-if="activity.byMember.imgUrl" :src="activity.byMember.imgUrl" alt="" />
                  <span v-else>{{ activity.byMember?._id ? activity.byMember.fullname.split(' ')[0].split('')[0] + activity.byMember.fullname.split(' ')[1].split('')[0] : 'G' }}</span>
                </div>
                <div class="card-comment activities">
                  <div>
                    <span class="comment-by">{{ activity.byMember.fullname }}</span>
                    <span class="activity-txt">{{ activity.txt }}</span>
                  </div>
                  <span class="comment-date">{{ formattedTime(activity.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-side-bar">
            <div class="action-container" v-if="!checkUser">
              <h3>Suggested</h3>
              <div @click="joinToCard" class="action-btn">
                <span class="icon ic-join"></span>
                <span>Join</span>
              </div>
            </div>
            <div class="action-container">
              <h3>Add to card</h3>
              <div class="action-btn" @click="openModal('member-picker', $event)">
                <span class="icon ic-join"></span>
                <span>Members</span>
              </div>
              <div class="action-btn" @click="openModal('label-picker', $event)">
                <span class="icon ic-label"></span>
                <span>Labels</span>
              </div>

              <div class="action-btn" @click="openModal('checklist-add', $event)">
                <span class="icon ic-checklist"></span>
                <span>Checklist</span>
              </div>
              <div class="action-btn" @click="openModal('date-picker', $event)">
                <span class="icon ic-date"></span>
                <span>Dates</span>
              </div>
              <div class="action-btn" @click="openModal('attachments', $event)">
                <span class="icon ic-attachment"></span>
                <span>Attachment</span>
              </div>
              <div class="action-btn" @click="openModal('cover-picker', $event)">
                <span class="icon ic-cover"></span>
                <span>Cover</span>
              </div>
            </div>
            <div class="action-container">
              <h3>Actions</h3>
              <div class="action-btn" @click="openModal('move-card', $event)">
                <span class="icon ic-move"></span>
                <span>Move</span>
              </div>
              <div class="action-btn" @click="openModal('copy-card', $event)">
                <span class="icon ic-copy"></span>
                <span>Copy</span>
              </div>
              <div class="action-btn">
                <span class="icon ic-template"></span>
                <span class="template">Make template</span>
              </div>
              <div class="action-btn">
                <span class="icon ic-watch"></span>
                <span>Watch</span>
              </div>
              <hr />
              <div class="action-btn remove" @click="openModal('confirm-delete', $event)">
                <span class="icon ic-remove remove"></span>
                <span>Delete</span>
              </div>
              <div class="action-btn" @click="openModal('share-card', $event)">
                <span class="icon ic-share"></span>
                <span>Share</span>
              </div>
              <component
                v-if="cmpName"
                :is="cmpName"
                :card="card"
                :posLeft="posLeft"
                :isCopyCard="isCopyCard"
                @removeCard="removeCard"
                @closeModal="closeModal"
                @updateKey="updateKey"
                v-click-outside="() => closeModal()"
                :style="`top: ${posTop}px; left: ${posLeft}px`"
              ></component>
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
import datePicker from './date-picker.vue'
import checklistAdd from './checklist-add.vue'
import coverPicker from './cover-picker.vue'
import attachments from './attachments.vue'
import FastAverageColor from 'fast-average-color'
import confirmDelete from './confirm-delete.vue'
import moveCard from './move-card.vue'
import shareCard from './share-card.vue'
import videoPlayer from './video-player.vue'

export default {
  components: {
    labelPicker,
    memberPicker,
    checklistAdd,
    coverPicker,
    attachments,
    confirmDelete,
    datePicker,
    moveCard,
    shareCard,
    videoPlayer,
  },
  data() {
    return {
      isTextArea: false,
      card: null,
      lastCard: null,
      boardId: null,
      cardId: null,
      groupId: null,
      isShowActivity: false,
      isCommentsInput: false,
      newComment: {
        txt: '',
        createdAt: null,
        byMemberId: this.$store.getters.loggedinUser?._id || '',
      },
      cmpName: null,
      description: null,
      isAddTodo: null,
      newTodo: {
        title: '',
        isDone: false,
      },
      coverColor: null,
      isCopyCard: false,
      posTop: null,
      posLeft: null,
    }
  },
  created() {
    this.cardId = this.$route.params.cardId
    this.boardId = this.$route.params.boardId
    this.loadCard()
  },
  methods: {
    openModal(cmpName, ev) {
      this.calcPosition(ev.target.getBoundingClientRect())
      if (cmpName === 'copy-card') {
        this.isCopyCard = true
        cmpName = 'move-card'
      } else this.isCopyCard = false
      this.cmpName = cmpName
    },
    calcPosition(rect) {
      var { left } = rect
      const winWidth = window.innerWidth
      if (winWidth - left < 300) {
        left = winWidth - 330
      }
      this.posTop = 100
      this.posLeft = left
    },
    closeModal() {
      this.cmpName = null
    },
    async updateTitle() {
      await this.addActivity('updated card title')
      this.updateCard()
    },
    async updateKey(key, value, activity) {
      if (key === 'checklists' || key === 'attachments') {
        value.id = utilService.makeId()
        this.card[key].push(value)
      } else this.card[key] = value
      if (activity) await this.addActivity(activity)
      await this.updateCard()
    },
    closeEdit() {
      this.$router.push(`/board/${this.boardId}`)
    },
    async loadCard() {
      const cardDetails = await this.$store.dispatch({ type: 'getCardById', boardId: this.boardId, cardId: this.cardId })
      this.card = cardDetails.card
      this.description = cardDetails.card?.description || ''
      this.groupId = cardDetails.groupId
      this.checkCover()
    },
    showActivity() {
      this.isShowActivity = !this.isShowActivity
    },
    toggleCommentsInput() {
      this.isCommentsInput = !this.isCommentsInput
    },
    postComment() {
      if (!this.newComment.txt) return
      var comment = JSON.parse(JSON.stringify(this.newComment))
      comment.txt.trim()
      comment.createdAt = Date.now()
      comment.id = utilService.makeId()
      this.card.comments.unshift(comment)
      this.updateCard()
      this.isCommentsInput = false
      this.newComment.txt = ''
    },
    async updateCard() {
      if (!this.card.title) return
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
    async toggleTodo(todoId, checklistId) {
      const clIdx = this.card.checklists.findIndex((cl) => cl.id === checklistId)
      const todoIdx = this.card.checklists[clIdx].todos.findIndex((t) => t.id === todoId)
      this.card.checklists[clIdx].todos[todoIdx].isDone = !this.card.checklists[clIdx].todos[todoIdx].isDone
      if (this.card.checklists[clIdx].todos[todoIdx].isDone) {
        await this.addActivity(`marked ${this.card.checklists[clIdx].todos[todoIdx].title} completed at checklist ${this.card.checklists[clIdx].title}`)
      } else await this.addActivity(`unmarked ${this.card.checklists[clIdx].todos[todoIdx].title} at checklist ${this.card.checklists[clIdx].title}`)
      this.updateCard()
    },
    async updateDescription() {
      this.card.description = this.description
      await this.addActivity(`added description to card ${this.card.title}`)
      this.updateCard()
      this.isTextArea = false
    },
    async addTodo(checklistId, checklist) {
      var newTodo = JSON.parse(JSON.stringify(this.newTodo))
      newTodo.title = JSON.parse(JSON.stringify(checklist.newTodo))
      checklist.newTodo = ''
      if (!newTodo.title) return
      newTodo.id = utilService.makeId()
      const idx = this.card.checklists.findIndex((cl) => cl.id === checklistId)
      this.card.checklists[idx].todos.push(newTodo)
      await this.addActivity(`added ${newTodo.title} to the checklist ${this.card.checklists[idx].title}`)
      this.updateCard()
    },
    closeTodoInput(checklist) {
      checklist.newTodo = ''
      this.isAddTodo = null
    },
    openUrl(url) {
      window.open(url)
    },
    async removeChecklist(idx) {
      await this.addActivity(`removed checklist ${this.card.checklists[idx].title}`)
      this.card.checklists.splice(idx, 1)
      this.updateCard()
    },
    async checkCover() {
      if (!this.card.style.cover) return ''
      try {
        const fac = new FastAverageColor()
        if (this.card.style.type === 'url') this.coverColor = await fac.getColorAsync(this.card.style.cover)
      } catch (err) {
        console.log(err)
      }
    },
    async removeCard() {
      this.addActivity(`removed card ${this.card.title}`)
      await this.$store.dispatch('removeCard', { groupId: this.groupId, cardId: this.cardId })
      this.closeEdit()
    },
    async addActivity(txt) {
      await this.$store.dispatch({ type: 'addActivity', txt, card: this.card })
    },
    async joinToCard() {
      this.card.memberIds.push(this.$store.getters.loggedinUser._id)
      await this.addActivity(`${this.$store.getters.loggedinUser.fullname} Joined card`)
      this.updateCard()
    },
    formattedTime(time) {
      return utilService.getFormattedTime(time)
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
    comments() {
      var members = JSON.parse(JSON.stringify(this.$store.getters.users))
      members.push(JSON.parse(JSON.stringify(this.$store.getters.currBoard.members)))
      const card = JSON.parse(JSON.stringify(this.card))
      return card.comments.map((c) => {
        var currMember = members.find((m) => m._id === c.byMemberId)
        c.byMember = currMember
        return c
      })
    },
    groupTitle() {
      const board = this.$store.getters.currBoard
      const group = board.groups.find((group) => group.id === this.groupId)
      return group.title
    },
    cover() {
      if (this.card.style.type === 'url') return `background-image:url('${this.card.style.cover}')`
      else return `background-color: ${this.card.style.cover}`
    },
    coverType() {
      if (this.card.style.type === 'url') return 'card-cover-image'
      else return 'card-cover-color'
    },
    coverButtonClass() {
      if (!this.card.style.cover) return ''
      if (this.card.style.type === 'color') {
        return this.card.style.cover === '#172B4D' ? 'on-cover-icon-dark' : 'on-cover-icon'
      } else return this.coverColor?.isDark ? 'on-cover-icon-dark' : 'on-cover-icon'
    },
    formattedDate() {
      const date = new Date(this.card.dueDate.date)
      const month = date.toLocaleString('en-US', { month: 'short' })
      const day = date.getDate()
      const hour = this.card.dueDate.time
      return `${month} ${day} at ${hour}`
    },
    activities() {
      const activities = this.$store.getters.currBoard.activities
      return activities.length ? activities.filter((ac) => ac.card.id === this.card.id) : []
    },
    checkUser() {
      return this.card.memberIds.includes(this.$store.getters.loggedinUser?._id)
    },
  },
}
</script>
