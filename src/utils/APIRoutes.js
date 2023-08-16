export const host = process.env.REACT_APP_HOST;
export const loginRoute = `${process.env.REACT_APP_HOST}/api/auth/login`;
export const registerRoute = `${process.env.REACT_APP_HOST}/api/auth/register`;
export const logoutRoute = `${process.env.REACT_APP_HOST}/api/auth/logout`;
export const allUsersRoute = `${process.env.REACT_APP_HOST}/api/auth/allusers`;
export const sendMessageRoute = `${process.env.REACT_APP_HOST}/api/messages/addmsg`;
export const recieveMessageRoute = `${process.env.REACT_APP_HOST}/api/messages/getmsg`;
export const setAvatarRoute = `${process.env.REACT_APP_HOST}/api/auth/setavatar`;
