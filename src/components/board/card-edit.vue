<template>
  <section v-if="card" class="card-edit">
    <div @click="closeEdit" class="window-overlay">
      <div @click.stop class="card-modal">
        <div class="card-modal-details">
          <i @click="closeEdit" class="fa-solid fa-xmark close-modal-button"></i>
          <div class="modal-header">
            <span class="modal-header-icon">
              <i class="fa-solid fa-tachograph-digital"></i>
            </span>
            <div class="modal-header-title">
              <textarea v-model="card.title" dir="auto" data-autosize="true"></textarea>
            </div>
            <div class="inline-content">in list {the card list}</div>
          </div>
          <div class="modal-main-content">
            <div class="card-details">
              <div class="card-details-item">
                <h3>Members</h3>
                <div class="member">
                  <img src="https://trello.com/1/cards/62399dba78ab2987b393bef4/attachments/6239ba94c62cb36ebd4d3023/previews/6239ba95c62cb36ebd4d3042/download/T02L3AYJGN4-U02RAGA3ZJP-0b63d8a04626-512.png" alt="" />
                </div>
                <div class="add-member"><i class="fa-solid fa-plus"></i></div>
              </div>
              <div class="card-details-item">
                <h3>Labels</h3>
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
                <pre v-if="!isTextArea && card.description" @click="isTextArea = true">{{ card.description }}</pre>
                <div v-if="!isTextArea && !card.description" class="fake-text-area" @click="isTextArea = true">
                  <p>Add a more detailed description…</p>
                </div>
                <div v-if="isTextArea">
                  <textarea autofocus v-model="description" placeholder="Add a more detailed description…"></textarea>
                  <button @click="updateCard('description', 'singleVal', description)" class="save-btn">Save</button>
                  <span @click="isTextArea = false"><i class="fa-solid fa-xmark"></i></span>
                </div>
              </div>
            </div>
            <div v-for="checklist in card.checklists" :key="checklist.id" class="checklist-container">
              <div class="title">
                <span>
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
                  <div class="todo-checkbox"><span></span></div>
                  <div class="todo-title-container" :class="todo.isDone ? 'todo-completed' : ''">
                    <div class="todo-title">{{ todo.title }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="activity-container">
              <div class="title">
                <span>
                  <i class="fa-solid fa-list-ul"></i>
                </span>
                <h3>Activity</h3>
                <button v-if="isShowActivity" @click="showActivity" class="grey-btn">Hide details</button>
                <button v-else @click="showActivity" class="grey-btn">Show details</button>
              </div>
              <div class="comments-frame">
                <div class="comments-input">
                  <textarea @focus="isCommentsInput = true" :class="commentsInputStyle" v-model="newComment.txt" placeholder="Write a comment..."></textarea>
                  <button v-if="isCommentsInput" @click.stop="updateCard('comments', 'update', newComment)" :class="isCommentsText">Save</button>
                </div>
                <pre v-if="card.comments.length">{{ card.comments }}</pre>
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
              <div class="action-btn">
                <span><i class="fa-solid fa-user"></i></span>
                <span>Members</span>
              </div>
              <div class="action-btn" @click="openModal('label-picker')">
                <span><i class="fa-solid fa-tags"></i></span>
                <span>Labels</span>
              </div>
              <component v-if="cmpName" :is="cmpName" :labelIds="card.labelIds" @cmpChange="cmpChange" @closeModal="closeModal" @updateKey="updateKey"></component>
              <div class="action-btn">
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
              <div class="action-btn">
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
import labelPicker from './label-picker.vue'

export default {
  components: {
    labelPicker,
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
        id: '',
        txt: '',
        createdAt: Date.now(),
        byMember: 'me',
      },
      cmpName: null,
      description: null,
    }
  },
  created() {
    console.log('here');
    this.cardId = this.$route.params.cardId
    this.boardId = this.$route.params.boardId
    this.loadCard()
  },
  methods: {
    cmpChange() {
      this.closeModal
    },
    openModal(cmpName) {
      this.cmpName = cmpName
    },
    closeModal() {
      this.cmpName = null
    },
    updateKey(key, value){
      this.card[key] = value
    },
    closeEdit() {
      this.$router.push(`/board/${this.boardId}`)
    },
    async loadCard() {
      const cardDetails = await this.$store.dispatch({ type: 'getCardById', boardId: this.boardId, cardId: this.cardId })
      this.card = cardDetails.card
      this.description = cardDetails.card?.description || ''
      this.groupId = cardDetails.groupId
      console.log('cardDetails',cardDetails);
    },
    showActivity() {
      this.isShowActivity = !this.isShowActivity
    },
    toggleCommentsInput() {
      this.isCommentsInput = !this.isCommentsInput
    },
    postComment() {
      if (!this.newComment) return
      console.log('this.newComment', this.newComment)
    },
    updateCard(key, action, value) {
      const changes = {
        key: key,
        action: action,
        value: value,
      }
      if (key === 'description') this.isTextArea = false
      if (key === 'comments') {
        this.toggleCommentsInput()
        if (value.txt === '') return
      } 
      this.$store.dispatch({type: 'updateCard', groupId: this.groupId, cardId: this.card.id, changes})
      // this.$store.dispatch({type: 'updateCard', groupId: this.groupId, card: this.card})
    },
    joinCard() {
      //TODO - finish the updateCard function at the service
      // this.card.members.push(this.$store.getters.user)
      //this.updateCard()
    },
    addMember(member) {
      //TODO - finish the updateCard function at the service
      // this.card.members.push(member)
      //this.updateCard()
    },
    addLabel(label) {
      //TODO - finish the updateCard function at the service
      // this.card.labels.push(label)
      //this.updateCard()
    },
    calcProgress(todos) {
      const doneTodos = todos.reduce((acc, todo) => {
        if (todo.isDone) acc++
        return acc
      }, 0)
      var precent = (doneTodos * 100) / todos.length + '%'
      return precent
    },
    // updateLabels(newLabels){
    //   this.card.labels= newLabels
    //   this.dispatch
    // }
  },
  computed: {
    commentsInputStyle() {
      return this.isCommentsInput ? 'active-input' : ''
    },
    isCommentsText() {
      return this.newComment ? 'save-btn' : 'not-allowed-btn'
    },
  },
}
</script>

<style></style>
