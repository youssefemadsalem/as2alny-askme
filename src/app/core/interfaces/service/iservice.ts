export interface IService {
  success: boolean
  data: Daum[]
  pagination: Pagination
}

export interface Daum {
  _id: string
  coreInfo: CoreInfo
  procedures: Procedure[]
  requiredDocuments: RequiredDocument[]
  locations: any[]
  isOnline: boolean
  status: string
  tags: string[]
  averageRating: number
  totalRatings: number
  createdBy: CreatedBy
  __v: number
  createdAt: string
  updatedAt: string
  onlineUrl?: string
}

export interface CoreInfo {
  name: string
  description: string
  image: Image
  category: string
  subCategory: string
  fees: number
  currency: string
  processingTime: string
  responsibleDepartment: string
  _id: string
}

export interface Image {
  url: string
  publicId: string
}

export interface Procedure {
  stepNumber: number
  title: string
  description: string
  estimatedTime: string
  _id: string
}

export interface RequiredDocument {
  name: string
  description: string
  isMandatory: boolean
  acceptedFormats: string[]
  _id: string
}

export interface CreatedBy {
  _id: string
  name: string
  email: string
  nationalId: string
  role: string
  isActive: boolean
  phoneNumber: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
