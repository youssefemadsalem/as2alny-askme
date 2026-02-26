export interface UserDataInterface {
  _id?: string;
  name: string;
  email: string;
  nationalId?: number;
  role?: string;
  isActive?: boolean;
  phoneNumber: string;
  profilePicture?:string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
