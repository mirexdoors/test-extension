export const API_URL = 'http://www.softomate.net/ext/employees/list.json';
export const fetchDomains = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  return false;
};
export const isTimePass = (lastDate) => {
  if (lastDate instanceof Date) {
    const currentDate = new Date();
    const passedTime = Math.abs(currentDate.getTime() - lastDate.getTime()) / 3600000; // time
    // in hours
    return passedTime >= 1 && true;
  }
  return null;
};
