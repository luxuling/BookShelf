const addBtn = document.getElementById("add-book")
const form = document.getElementById("form")

addBtn.addEventListener("click", (event) => {
  event.preventDefault()
  form.classList.add("form-active")
})

const closeBtn = document.getElementById("close-form")
closeBtn.addEventListener("click", (event) => {
  event.preventDefault()
  form.classList.remove("form-active")
})
document.addEventListener("DOMContentLoaded", () => {
  const submit = document.getElementById("submit")
  const search = document.getElementById("search-btn")
  loadBook()
  search.addEventListener("click", (event) => {
    event.preventDefault()
    displaySearch()

  })
  submit.addEventListener("click", (event) => {
    event.preventDefault()
    addBook()
    form.classList.remove("form-active")  
  })
})

let listBook = []

const generateObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
} 

const makeId = () => {
  return + new Date()
}
const checkThis = ()=>{
  let cBox = document.getElementById("checkbox")
  return cBox.checked
}
const addBook = () => {
  let id = makeId()
  let title = document.getElementById("title").value
  let author = document.getElementById("author").value  
  let year = document.getElementById("date").value
  let checkboxVal = checkThis()
  let objData = generateObject(id, title, author, year, checkboxVal)
  listBook.push(objData)
  
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const makeBookList = (objData)=>{
  const book = document.createElement("div")
  book.classList.add("book")

  const title = document.createElement("h4")
  title.innerText = objData.title

  const author = document.createElement("p")
  author.innerText = `Author: ${objData.author}`

  const date = document.createElement("p")
  date.innerText = `Published: ${objData.year}`

  book.append(title, author, date)

  if (objData.isComplete) {
    const divBtn = document.createElement("div")

    const undo = document.createElement("button")
    undo.classList.add("undo")
    undo.innerText = "UnFinished"
    undo.addEventListener("click", (event) => {
      event.preventDefault()
      const display = document.getElementById("display-search")
      display.classList.remove("display-search-active")
      undoButton(objData.id)
    })

    const remove = document.createElement("button")
    remove.classList.add("remove")
    remove.innerText = "Remove"
    remove.addEventListener("click", (event) => {
      event.preventDefault()
      const confirm = document.getElementById("confirm")
      const yes = document.getElementById("yes")
      const no = document.getElementById("no")
      confirm.classList.add("confirm-active")
      
      
      yes.addEventListener("click", (event) =>{
        event.preventDefault()
        confirm.classList.remove("confirm-active")
        const display = document.getElementById("display-search")
        display.classList.remove("display-search-active")
        removeButton(objData.id)
      })
      no.addEventListener("click", (event) =>{
        event.preventDefault()
        confirm.classList.remove("confirm-active")
      })
    })

    divBtn.append(undo, remove)
    book.append(divBtn)
  } else {
    const divBtn = document.createElement("div")

    const finish = document.createElement("button")
    finish.classList.add("finish")
    finish.innerText = "Finished"
    finish.addEventListener("click", (event) => {
      event.preventDefault()
      const display = document.getElementById("display-search")
      display.classList.remove("display-search-active")
      finishButton(objData.id)
    })

    const remove = document.createElement("button")
    remove.classList.add("remove")
    remove.innerText = "Remove"
    remove.addEventListener("click", (event) => {
      event.preventDefault()
      const confirm = document.getElementById("confirm")
      const yes = document.getElementById("yes")
      const no = document.getElementById("no")
      confirm.classList.add("confirm-active")
      

      yes.addEventListener("click", (event) =>{
        event.preventDefault()
        confirm.classList.remove("confirm-active")
        const display = document.getElementById("display-search")
        display.classList.remove("display-search-active")
        removeButton(objData.id)
      })
      no.addEventListener("click", (event) =>{
        event.preventDefault()
        confirm.classList.remove("confirm-active")
      })
    })

    divBtn.append(finish, remove)
    book.append(divBtn)
  }
  return book
}

const RENDER_EVENT = "render-book"
document.addEventListener(RENDER_EVENT, () => {
  const finished = document.querySelector(".finished .wrapper")
  finished.innerHTML = ""
  const unFinished = document.querySelector(".unfinished .wrapper")
  unFinished.innerHTML = ""

  for (let book of listBook) {
    let itemElement = makeBookList(book)
    if (!book.isComplete) {
      unFinished.append(itemElement)
    } else {
      finished.append(itemElement)
    }
  }
})

const findId = (objectId)=>{
  for (let isId of listBook) {
    if (isId.id == objectId) {
      return isId
    }
  }
  return null
}

const undoButton = (objectId) =>{
  let itemCheck = findId(objectId)

  if (itemCheck == null) return
  
  itemCheck.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const finishButton = (objectId) => {
  let itemCheck = findId(objectId)
  
  if(itemCheck == null) return
  
  itemCheck.isComplete = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const findIndex = (objectId) => {
  for(let index in listBook){
    if(listBook[index].id == objectId){
      return index
    }
  }
    return -1
}

const removeButton = (objectId) => {
  let itemIndex = findIndex(objectId)
   
   if(itemIndex == -1) return
   
   listBook.splice(itemIndex, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const findBook = (searchValue) => {
  for (let index of listBook){
    if(index.title == searchValue){
      return index
    }
  }
  return null
}

const displaySearch = ()=>{
  const searchValue = document.getElementById("search-input").value
  const card = document.getElementById("card-search")
  const display = document.getElementById("display-search")
  const close = document.getElementById("close")
  display.classList.add("display-search-active")
  card.innerHTML = ""

  close.addEventListener("click", (event) => {
    event.preventDefault()
    display.classList.remove("display-search-active")
  })
  const book = findBook(searchValue)
  if (book) {
    const bookElement = makeBookList(book)
    card.append(bookElement)
  } else {
    card.innerHTML = `<h4 class="warn">not found!!!</h4>`
  }
}

let BOOKS_KEY = "book-list"

function isStorage(){
  if(typeof(Storage)){
    return true
  }else{
    return null
  }
}

function saveData(){
  if(isStorage == null){
    alert("browser anda tidak suport localStorage")
  }else{
      let string = JSON.stringify(listBook)
      localStorage.setItem(BOOKS_KEY, string)
  }
}

function loadBook(){
  let dataBook = localStorage.getItem(BOOKS_KEY)
  let parsed = JSON.parse(dataBook)
  
  if(dataBook != null){
    for(let item of parsed){
      listBook.push(item)
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT))
}