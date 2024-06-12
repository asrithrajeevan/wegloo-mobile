import {emptyFunction} from 'app/utils/common';
import create from 'zustand';
import {ICurrentUser} from '~app/models/user';
import {createSelectors} from './state';
interface IAppState {
  actionCount: number;
  profileImage: string;
  uid: string;
  experiences: Array;
  setExperiences: (user: object) => void;
  setUiId: (id: string) => void;
  setProfileImage: (image: string) => void;
  showLoader: () => void;
  hideLoader: () => void;
  setDisplayMode: (mode: boolean) => void;
  displayMode: boolean;
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  setUser: (user: object) => void;
  user: object;
  setPhoneNumber: (number: string) => void;
  setCanvasPhotos: (images: Array) => void;
  canvasPhotos: Array;
  phoneNumber: string;
  countryCode: string;
  callingCode: number;
  setCountryCodeName: (code: string) => void;
  setCallingCode: (code: string) => void;
  setAllUsers: (user: object) => void;
  allUsers: Array;
  currentUser: ICurrentUser;
  defalut: boolean;
  setCurrentUser: (user: object) => void;
  setDefault: (mode: boolean) => void;
  loader: boolean;
  setLoader: (mode: boolean) => void;
  currentLatitude: number;
  currentLongitude: number;
  currentLocation: string;
  setCurrentLocation: (value: string) => void;
  experimentPhotos: Array;
  setExperiencePhotos: (images: Array) => void;
  setCurrentLatitude: (value: number) => void;
  setCurrentLongitude: (value: number) => void;
  photos: Array;
  setPhotos: (images: object) => void;
}

const initialState: IAppState = {
  actionCount: 0,
  uid: '',
  setUiId: () => emptyFunction,
  canvasPhotos: null,
  setCanvasPhotos: images => emptyFunction,
  displayMode: false,
  authenticated: false,
  user: {},
  profileImage: '',
  setProfileImage: () => emptyFunction,
  phoneNumber: '',
  countryCode: '',
  callingCode: 1,
  allUsers: [],
  currentUser: {},
  defalut: false,
  loader: false,
  currentLatitude: 31.09,
  currentLongitude: 121.09,
  currentLocation: '',
  experimentPhotos: [],
  photos: [],
  setPhotos: () => emptyFunction,
  experiences: [],
  setExperiences: () => emptyFunction,
  setExperiencePhotos: () => emptyFunction,

  setCurrentLocation: () => emptyFunction,

  setCurrentLatitude: () => emptyFunction,
  setCurrentLongitude: () => emptyFunction,
  setCurrentUser: () => emptyFunction,
  setCountryCodeName: emptyFunction,
  setCallingCode: emptyFunction,
  showLoader: emptyFunction,
  hideLoader: emptyFunction,
  setDisplayMode: emptyFunction,
  setAuthenticated: emptyFunction,
  setUser: emptyFunction,
  setPhoneNumber: emptyFunction,
  setAllUsers: emptyFunction,
  setDefault: emptyFunction,
  setLoader: emptyFunction,
};

export const useAppState = create<IAppState>((set, get) => ({
  ...initialState,
  setUiId: id => {
    set({uid: id});
  },
  setExperiences: item => {
    set({experiences: item});
  },
  setPhotos: item => {
    set({photos: item});
  },
  setExperiencePhotos: images => {
    set({experimentPhotos: images});
  },
  setCanvasPhotos: images => {
    set({canvasPhotos: images});
  },
  setCurrentLatitude: value => {
    set({currentLatitude: value});
  },
  setCurrentLocation: value => {
    set({currentLocation: value});
  },
  setCurrentLongitude: value => {
    set({currentLongitude: value});
  },
  setDisplayMode: mode => {
    set({displayMode: mode});
  },
  setProfileImage: image => {
    set({profileImage: image});
  },
  setDefault: mode => {
    set({defalut: mode});
  },
  setCurrentUser: user => {
    set({currentUser: user});
  },
  setCallingCode: code => {
    set({callingCode: code});
  },
  setCountryCodeName: code => {
    set({countryCode: code});
  },
  setPhoneNumber: number => {
    set({phoneNumber: number});
  },
  setUser: user => {
    set({user: user});
  },
  setAuthenticated: auth => {
    set({authenticated: auth});
  },
  setLoader: value => {
    set({loader: value});
  },
  setAllUsers: users => {
    set({allUsers: users});
  },
  hideLoader: () =>
    set({actionCount: get().actionCount < 0 ? 0 : get().actionCount - 1}),
}));

export const appStateSelectors = createSelectors(initialState);
