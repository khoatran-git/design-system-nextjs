import { groq } from 'next-sanity'

export const componentsQuery = groq`*[_type == "component" && status == "published"] | order(publishedAt desc) {
  _id,
  name,
  slug,
  description,
  status,
  publishedAt,
}`

export const componentBySlugQuery = groq`*[_type == "component" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  overview,
  specifications,
  documentation,
  props,
  examples,
  relatedComponents[] -> {
    _id,
    name,
    slug,
  },
  status,
  publishedAt,
}`

export const foundationsQuery = groq`*[_type == "foundation" && status == "published"] | order(category) {
  _id,
  name,
  slug,
  category,
  description,
  status,
  publishedAt,
}`

export const foundationBySlugQuery = groq`*[_type == "foundation" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  category,
  description,
  content,
  relatedFoundations[] -> {
    _id,
    name,
    slug,
    category,
  },
  status,
  publishedAt,
}`

export const foundationsByCategoryQuery = groq`*[_type == "foundation" && category == $category && status == "published"] | order(name) {
  _id,
  name,
  slug,
  category,
  description,
  status,
}`

export const resourcesQuery = groq`*[_type == "resource" && status == "published"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  resourceType,
  url,
  icon,
  order,
  status,
}`

export const resourceBySlugQuery = groq`*[_type == "resource" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  resourceType,
  url,
  content,
  icon,
  status,
}`
