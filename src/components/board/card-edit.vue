<template>
    <section v-if="card" class="card-edit">
        <div @click="closeModal" class="window-overlay">
            <div @click.stop class="card-modal">
                <div class="card-modal-details">
                    <i  @click="closeModal" class="fa-solid fa-xmark close-modal-button"></i>
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
                                    <img src="https://trello.com/1/cards/62399dba78ab2987b393bef4/attachments/6239ba94c62cb36ebd4d3023/previews/6239ba95c62cb36ebd4d3042/download/T02L3AYJGN4-U02RAGA3ZJP-0b63d8a04626-512.png" alt="">
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
                                <div v-if="!isTextArea" class="fake-text-area" @click="isTextArea = true">
                                    <p v-if="card.description">{{card.description}}</p>
                                    <p v-else >Add a more detailed description…</p>
                                </div>
                                <div v-else>
                                    <textarea :hidden="isTextArea" autofocus v-model="card.description" placeholder="Add a more detailed description…"></textarea>
                                    <button class="save-btn">Save</button>
                                    <span @click="isTextArea = false"><i class="fa-solid fa-xmark"></i></span>
                                </div>
                            </div>
                        </div>
                        <div class="activity-container">
                            <div class="title">
                                <span>
                                    <i class="fa-solid fa-list-ul"></i>
                                </span>
                                <h3>Activity</h3>
                                <button v-if="isShowActivity" @click="showActivity" class="details-btn">Hide details</button>
                                <button v-else @click="showActivity" class="details-btn">Show details</button>
                            </div>
                            <div class="comments-frame">
                                <div class="comments-input">
                                    <textarea @focus="openCommentsInput()" @blur="openCommentsInput()" :class="commentsInputStyle" autofocus v-model="newComment" placeholder="Write a comment..."></textarea>
                                    <button v-if="isCommentsInput" @click.stop="postComment" :class="isCommentsText">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-side-bar">
                        <div class="action-container">
                            <h3>Suggested</h3>
                            <div class="action-btn">
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
                            <div class="action-btn">
                            <span><i class="fa-solid fa-tags"></i></span>
                            <span>Labels</span>
                            </div>
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
                            <hr>
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
 
export default {
 
created() {
    this.cardId = this.$route.params.cardId
    this.boardId = this.$route.params.boardId
    this.loadCard()
},
 data() {
return {
 isTextArea: false,
 card: null,
 boardId: null,
 cardId: null,
 isShowActivity: false,
 isCommentsInput: false,
 newComment: '',
};
 },
methods: {
    closeModal() {
        this.$router.push(`/board/${this.boardId}`)
    },
    async loadCard() {
        this.card = await this.$store.dispatch({type: 'getCardById', boardId: this.boardId, cardId: this.cardId})
    },
    showActivity() {
        this.isShowActivity = !this.isShowActivity
    },
    openCommentsInput() {
        this.isCommentsInput = !this.isCommentsInput
    },
    postComment() {
        if(!this.newComment) return
        console.log('this.newComment',this.newComment);
    }
},
computed: {
    commentsInputStyle() {
        return this.isCommentsInput ? 'active-input' : ''
    },
    isCommentsText() {
        return this.newComment ? 'save-btn' : 'not-allowed-btn'
    }
},
components: {
},
};
</script>
 
<style>
 
</style>