export interface ArticleListResponse {
  code: number
  data: Data
  message: string
  originUrl: string
  [property: string]: any
}

export interface Data {
  list: List[]
  pageNo: number
  pageSize: number
  total: number
  [property: string]: any
}

export interface List {
  article_comment_count: string
  article_description: string
  article_id: number
  article_like_count: string
  article_public_date: string
  article_status: string
  article_title: string
  article_views: string
  author: Author
  categories: Category[]
  cover_src: string
  create_date: string
  tags: Tag[]
  update_date: string
  [property: string]: any
}

export interface Author {
  createTime: string
  email: string
  headPic: null
  id: number
  isAdmin: boolean
  isFrozen: boolean
  nickName: string
  password: string
  phoneNumber: null | string
  updateTime: string
  username: string
  [property: string]: any
}

export interface Category {
  category_description: string
  category_id: number
  category_name: string
  category_slug: string
  create_date: string
  update_date: string
  [property: string]: any
}

export interface Tag {
  create_date: string
  tag_description: string
  tag_id: number
  tag_name: string
  tag_slug: string
  update_date: string
  [property: string]: any
}
