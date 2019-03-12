let users = {
  1: {
    id: '1',
    username: 'sri420',
    email:'gsamartian@cheerful.com',
    password:'test123$',
    messageIds: [1],
    roles:[
        'ADMIN'
    ]
  },
  2: {
    id: '2',
    username: 'surya143',
    messageIds: [2],
	email:'surya@cheerful.com',
    password:'test124$',
    roles:[
        'ADMIN',
        'MEMBER'
    ]
  },
  3:{
     id: '3',
     username: 'gajala123',
     messageIds: [3],
	 email:'gajala@cheerful.com',
     password:'test125$',
      roles:[
        'MEMBER'
    ]
  }
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
  3: {
    id: '3',
    text: 'WTF',
    userId: '3'
  }
};

export default {
  users,
  messages,
};