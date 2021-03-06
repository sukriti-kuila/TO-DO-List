//π ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('form');
const todo = document.getElementById('todo');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.list-container');
const list = document.querySelector('.list');
const clearBtn = document.querySelector('.clear-btn');

//π edit option
let editElement;
let editFlag = false;
let editID = "";
let visibility = 0;

//π ****** EVENT LISTENERS **********
//π Submit Button 
form.addEventListener("submit", addItem);
//π Delete Button 
clearBtn.addEventListener("click", clearItems);
//π Load Items when the page get refreshed
window.addEventListener("DOMContentLoaded", setupItems);

//π ****** FUNCTIONS **********
function addItem (e) 
{
    e.preventDefault();
    const value = todo.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag ) 
    {
    createListItem(id,value);    
    displayAlert("task added", "success");
    visibility++;

    //π function add to local storageπ
    addToLocalStorage(id, value);
    //π set back to default 
    setBackTODefault();
    }

    else if (value && editFlag) 
    {
        editElement.textContent = value;
        editLocalStorage(editID, value);
        displayAlert("task updated", "success");
        setBackTODefault();   
    }
    else 
    {
        displayAlert("please enter a task", "danger");
    }

    //π Condition for clear List Button Visibility π
    visibilityFunction(visibility);

}
// π *** END OF SUBMIT BUTTON FUNCTION *** π

//π display alert 
function displayAlert(message, className) 
{
    alert.textContent = message;
    alert.classList.add (`alert-${className}`);

    //πremove the alert after one second
    setTimeout(e=>{
        alert.textContent = "";
        alert.classList.remove(`alert-${className}`);
    }, 1000);
}


// πDelete & Edit Button Function 
function deleteItems (e)
{
  const element =  e.currentTarget.parentElement.parentElement;
  element.remove();
    visibility -= 1;
    visibilityFunction(visibility);
    displayAlert("Task Deleted", "danger"); 
    const id = element.dataset.id;
    setBackTODefault();
    removeFromLocalStorage(id);
}

function editItems (e)
{
    const element =  e.currentTarget.parentElement.parentElement;
    editElement =  e.currentTarget.parentElement.previousElementSibling;
    // Show user the value in the input field that they are editing
    todo.value = editElement.textContent;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "Update";
}

// πClear Items
function clearItems()
{
    const items = document.querySelectorAll(".list-item");
    if (items.length>0)
    {
        items.forEach(function clear(item)
        {
            list.removeChild(item);
        });
    }
        visibility=0;
        visibilityFunction(visibility);
        displayAlert("List Cleared", "danger"); 
        setBackTODefault();
        localStorage.removeItem("list");
  
}


//π Set Back To Deafult
function setBackTODefault()
{
    todo.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit"; 
}

//π Clear List's visibity function 
function visibilityFunction (value)
{
    if (value>0)
    {
        clearBtn.style.display="inline";
    }
    else 
    {
        clearBtn.style.display="none";
    }
}


//π ****** LOCAL STORAGEπ **********
function addToLocalStorage(id, value)
{
    const taskList = {id:id, value:value};
    let items = getLocalStorage();
    // console.log(items);
    items.push(taskList);
    localStorage.setItem("list", JSON.stringify(items));
}

// π Edit From Loacal Deafult
function editLocalStorage(id, value)
{
    let items = getLocalStorage();
    items = items.filter(function(item){
        if (item.id == id)
        {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

// π Remove From Loacal Deafult
function removeFromLocalStorage(id)
{
    let items = getLocalStorage();
    items = items.filter(item => {
        if (item.id !== id)
        {
            return item;
        }
        
    });
    localStorage.setItem("list",JSON.stringify(items));
    

}

function getLocalStorage ()
{
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")) : [];
}

// Application in DOM
// Local Storage API
// setItem
// localStorage.setItem("name", JSON.stringify(["John", "Smith"]));
// getItem
// const name = JSON.parse(localStorage.getItem("name"));
// console.log(name);
// removeItem
// localStorage.removeItem("name");
// save as String





//π ****** SETUP ITEMS **********
function setupItems()
{
   let items = getLocalStorage();
   if (items.length>0)
   {
    items.forEach(function (item){
        createListItem(item.id, item.value);    
    });
    visibility++;
    visibilityFunction(visibility);
   }
}

function createListItem(id, value)
{
    const element = document.createElement("article");
    element.classList.add("list-item");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="item">${value}</p>
    <div class="btn-container">
        <button class="edit-btn">
            <i class="fas fa-edit edit-color"></i>
        </button>
        <button class="delete-btn">
            <i class="fas fa-trash delete-color"></i>
        </button>
    </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener("click",deleteItems);
    editBtn.addEventListener("click",editItems);
    list.appendChild(element);
}