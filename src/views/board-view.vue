<template>
  <section class="board-view">
    <h1>{{board.title}}</h1>
    <main>
      <article v-for="list in board.lists" :key="list.id">
        <list-cmp :list="list"></list-cmp>
      </article>
    </main>
  </section>
</template>

<script>
import listCmp from '../components/list-cmp.vue'

export default {
  name: 'cmp name',
  components: {
    listCmp
  },
  created() {},
  data() {
    return {
      board: {
        _id: 'b101',
        title: 'Robot dev proj',
        createdAt: 1589983468418,
        createdBy: {
          _id: 'u101',
          fullname: 'Abi Abambi',
          imgUrl: 'http://some-img',
        },
        style: {},
        labels: [
          {
            id: 'l101',
            title: 'Done',
            color: '#61bd4f',
          },
          {
            id: 'l102',
            title: 'Progress',
            color: '#61bd33',
          },
        ],
        members: [
          {
            _id: 'u101',
            fullname: 'Tal Tarablus',
            imgUrl: 'https://www.google.com',
          },
        ],
        lists: [
          {
            id: 'g101',
            title: 'List 1',
            cards: [
              {
                id: 'c101',
                title: 'Replace logo',
              },
              {
                id: 'c102',
                title: 'Add Samples',
              },
            ],
            style: {},
          },
          {
            id: 'g102',
            title: 'List 2',
            cards: [
              {
                id: 'c103',
                title: 'Do that',
              },
              {
                id: 'c104',
                title: 'Help me',
                status: 'in-progress',
                description: 'description',
                comments: [
                  {
                    id: 'ZdPnm',
                    txt: 'also @yaronb please CR this',
                    createdAt: 1590999817436.0,
                    byMember: {
                      _id: 'u101',
                      fullname: 'Tal Tarablus',
                      imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                    },
                  },
                ],
                checklists: [
                  {
                    id: 'YEhmF',
                    title: 'Checklist',
                    todos: [
                      {
                        id: '212jX',
                        title: 'To Do 1',
                        isDone: false,
                      },
                    ],
                  },
                ],
                members: [
                  {
                    _id: 'u101',
                    username: 'Tal',
                    fullname: 'Tal Tarablus',
                    imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                  },
                ],
                labelIds: ['l101', 'l102'],
                createdAt: 1590999730348,
                dueDate: 16156215211,
                byMember: {
                  _id: 'u101',
                  username: 'Tal',
                  fullname: 'Tal Tarablus',
                  imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                },
                style: {
                  bgColor: '#26de81',
                },
              },
            ],
            style: {},
          },
        ],
        activities: [
          {
            id: 'a101',
            txt: 'Changed Color',
            createdAt: 154514,
            byMember: {
              _id: 'u101',
              fullname: 'Abi Abambi',
              imgUrl: 'http://some-img',
            },
            card: {
              id: 'c101',
              title: 'Replace Logo',
            },
          },
        ],
        // for monday
        cmpsOrder: ['status-picker', 'member-picker', 'date-picker'],
      },
    }
  },
  methods: {},
  computed: {},
  unmounted() {},
}
</script>
