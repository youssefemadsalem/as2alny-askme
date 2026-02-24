export interface Request {
  _id: string;
  userId: string;
  fullName: string;
  nationalId: string;
  serviceName: string;
  serviceDescription: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  __v: number;
}
