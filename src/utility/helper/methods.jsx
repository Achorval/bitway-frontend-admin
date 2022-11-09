import moment from "moment";

export const randomUUID = () => {
  return (
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1) +
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  );
};

export const subtaskTicket = () => {
  return (
    "#" +
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1) +
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  );
};

export const dateFormat = date => {
  return moment(date).format("MMMM Do, h:mm a");
};

export const onlyDate = date => {
  return moment(date).format("MMM Do");
};

export const datesWithYear = date => {
  return moment(date).format("MMM Do YYYY");
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const getAuth = () => {
  if (!localStorage) {
    return
  }

  const lsValue = localStorage.getItem('adminData')
  if (!lsValue) {
    return
  }

  try {
    const auth = JSON.parse(lsValue) 
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

/**
 ** Set logged in user
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
 export const setAuth = (auth) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem('userData', lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}