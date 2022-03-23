<template>
    <section class="card-edit">
        <div class="window-overlay">
            <div class="card-modal">
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
                                    <textarea autofocus v-model="card.description"></textarea>
                                    <button class="save-btn">Save</button>
                                    <span @click="isTextArea = false"><i class="fa-solid fa-xmark"></i></span>
                                </div>
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
 
name: 'card-edit',
props: {
    card: Object
},
 data() {
return {
 isTextArea: false,
};
 },
methods: {
    closeModal() {
        this.$emit('closeModal')
    }
},
computed: {
},
components: {
}
};
</script>
 
<style>
 
</style>