var storage = {
  setStorage(name,value){
    localStorage.setItem(name,JSON.stringify(value));
  },
  getStorage(name){
    return JSON.parse(localStorage.getItem(name))
  }
}
export default storage
