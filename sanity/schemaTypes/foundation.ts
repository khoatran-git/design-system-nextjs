import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'foundation',
  title: 'Foundation',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Foundation Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Principles', value: 'principles'},
          {title: 'Governance', value: 'governance'},
          {title: 'Design Tokens', value: 'design-tokens'},
          {title: 'Typography', value: 'typography'},
          {title: 'Colours', value: 'colours'},
          {title: 'Elevation', value: 'elevation'},
          {title: 'Motion', value: 'motion'},
          {title: 'Usability', value: 'usability'},
          {title: 'Accessibility', value: 'accessibility'},
          {title: 'UX Writing', value: 'ux-writing'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
        },
        {
          type: 'code',
          options: {language: 'tsx'},
        },
        {
          type: 'object',
          name: 'colorPalette',
          title: 'Color Palette',
          fields: [
            {
              name: 'colors',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'name', type: 'string'},
                    {name: 'hex', type: 'string'},
                    {name: 'rgb', type: 'string'},
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'typographyScale',
          title: 'Typography Scale',
          fields: [
            {
              name: 'scales',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'name', type: 'string'},
                    {name: 'size', type: 'string'},
                    {name: 'weight', type: 'string'},
                    {name: 'lineHeight', type: 'string'},
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedFoundations',
      title: 'Related Foundations',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'foundation'}]}],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['draft', 'published'],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.category,
      }
    },
  },
})
