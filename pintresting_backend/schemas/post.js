export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      title: 'Comments',
      name: 'comments',
      type: 'array',
      of: [{type: 'comment'}],
    },
    {
      title: 'Saved By',
      name: 'savedBy',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'user'}]}],
    },
  ],
}
