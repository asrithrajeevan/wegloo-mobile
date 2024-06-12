export interface IEmail {
  email: string;
}

export interface ILogin extends IEmail {
  password: string;
}

export interface ISignup extends ILogin {
  email: string;
  password: string;
  confirmPassword: string;
}
export interface IUserName {
  firstName: string;
  lastName: string;
  userName: string;
}
export interface ICurrentUser {
  firstName: string;
  lastName: string;
  username: string;
  location: string;
  profileImage: string;
  profileName: string;
  instagram: string;
  facebook: string;
  ticktok: string;
  twitter: string;
  snapChat: string;
  phoneNumber: string;
  website: string;
  email: string;
  bio: string;
  uid: string;
  canvasImages: Array;
  connections: Array;
  notifications: Array;
  id: string;
  experiences: Array;
  currentLatitude: string;
  currentLongitude: string;
  currentLocation: string;
}
