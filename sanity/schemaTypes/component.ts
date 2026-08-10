import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'component',
  title: 'Component',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Component Name',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'overview',
      title: 'Overview Content',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
        },
        {
          type: 'code',
          options: {language: 'tsx', languageAlternatives: []},
        },
      ],
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'object',
          name: 'specification',
          title: 'Specification',
          fields: [
            {name: 'label', type: 'string', title: 'Label'},
            {name: 'value', type: 'string', title: 'Value'},
          ],
        },
      ],
    }),
    defineField({
      name: 'documentation',
      title: 'Documentation',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
        },
        {
          type: 'code',
          options: {language: 'tsx', languageAlternatives: ['jsx', 'javascript']},
        },
      ],
    }),
    defineField({
      name: 'props',
      title: 'Props/Properties',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'prop',
          title: 'Prop',
          fields: [
            {name: 'propName', type: 'string', title: 'Prop Name'},
            {name: 'type', type: 'string', title: 'Type'},
            {name: 'description', type: 'string', title: 'Description'},
            {name: 'required', type: 'boolean', title: 'Required', initialValue: false},
            {name: 'defaultValue', type: 'string', title: 'Default Value'},
          ],
        },
      ],
    }),
    defineField({
      name: 'examples',
      title: 'Usage Examples',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'example',
          title: 'Example',
          fields: [
            {name: 'title', type: 'string', title: 'Title'},
            {
              name: 'code',
              type: 'code',
              title: 'Code',
              options: {language: 'tsx', languageAlternatives: ['jsx']},
            },
            {name: 'description', type: 'string', title: 'Description'},
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedComponents',
      title: 'Related Components',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'component'}]}],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['draft', 'published', 'deprecated'],
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
      media: 'slug',
    },
    prepare(selection) {
      return {...selection}
    },
  },
})
