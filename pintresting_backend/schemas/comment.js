export default {
  name: 'comment',
  title: 'Comment',
  type: 'object',
  fields: [
    {
      title: 'Commenter',
      name: 'commenter',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      title: 'Comment Text',
      name: 'commentText',
      type: 'text',
    },
  ],
}
