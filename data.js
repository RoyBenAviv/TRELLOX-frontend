const board = {
  title: 'board1',
  createdAt: 1589983468418,
  isStarred: false,
  createdBy: {
    _id: 'u101',
    fullname: 'Shani',
    imgUrl: 'img.png',
  },
  style: {
    bgcImgUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwzfHxjb2Rpbmd8ZW58MHx8fHwxNjQyMzU4NjIz&ixlib=rb-1.2.1&q=80&w=200',
  },
  labels: _getLabelsForPM(),
  members: [
    {
      _id: 'u102',
      fullname: 'Tamir',
      imgUrl: 'img.png',
    },
  ],
  groups: [
    group,
    group,
    {
      id: '456',
      cards: [
        {
          id: utilService.makeId(),
          title: 'card 1', //1
          status: 'in-progress', //1
          description: 'description sdfg sdfg sdfgh sdfgh sdfg', //1
          dueDate: 16156215211, //1
          createdAt: 1590999730348,
          checklists: [], //2
          comments: [], //2
          memberIds: ['u102'], //3
          labelIds: [], //3
          byMember: {
            _id: 'u101',
            username: 'Tal',
            fullname: 'Tal Tarablus',
            imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
          },
          style: {}, //2
        },
      ],
    },
  ],
  activities: [],
  cmpsOrder: [],
}

