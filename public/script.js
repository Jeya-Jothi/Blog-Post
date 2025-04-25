// Select elements
const deleteButtons = document.querySelectorAll(".js-delete-btn");
const modal = document.getElementById("confirmationModal");
// const postIndexInput = document.getElementById("postIndex");
const yesButton = document.querySelector(".js-btn-yes");
const noButton = document.querySelector(".js-btn-no");
const cards = document.querySelectorAll(".js-card");
const listCards = document.querySelectorAll(".js-our-content");
const editButton = document.querySelector(".js-edit-icon");

if(modal){
  modal.classList.add("hidden");
  modal.classList.remove("modal");
}

function closeConfirmation() {
  modal.classList.add("hidden");
  modal.classList.remove("modal");
  currentIndexId = null;
}

let currentIndexId = null;

// Add event listener to each delete button
deleteButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndexId = button.dataset.indexId;
    if(currentIndexId>=0){
     // Show the modal
     modal.classList.add("modal");
     modal.classList.remove("hidden");
    //  postIndexInput.value = indexId;
    }
  });
});
if(yesButton){
yesButton.addEventListener("click",()=>{
  if (currentIndexId >=0) {
    fetch("/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ indexId: currentIndexId }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload(); // Reload page to reflect deletion
        } else {
          console.error("Failed to delete the post");
        }
      })
      .catch((error) => console.error("Error:", error));
  }
  closeConfirmation();
});
}
if(noButton){
noButton.addEventListener("click",()=>{
  closeConfirmation();
});
}
// Close modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeConfirmation();
  }
});

// Handle card clicks to navigate to /view/:id
cards.forEach((card) => {
  card.addEventListener("click", () => {
    const indexId = card.dataset.indexId;
    if(indexId >=0 ){
      window.location.href = `/view/${indexId}`;
    }
  });
});


listCards.forEach((card)=>{
  card.addEventListener("click", () => {
    const indexId = card.dataset.indexId;
    if(indexId >=0 ){
      window.location.href = `/view/${indexId}`;  // client-side to server-side -> GET request.
    }
  });
});

console.log("script loaded")

// Get id from edit-icon (view.ejs)
if(editButton){
editButton.addEventListener("click",(e)=>{
  e.stopPropagation();
  const id = editButton.dataset.id;
  console.log(id);
  if(id){
    window.location.href = `/edit/${id}`;
  }
});
}

const rightHeader = document.querySelector(".js-right-header");
const menuBar = document.querySelector(".js-menu-bar");

function updateVisibility(){
  if(window.innerWidth>600){
    rightHeader.style.display="grid";
    menuBar.style.display="none";
    
  } else {
    rightHeader.style.display = "none";
    menuBar.style.display="inline-block";
  }
}

document.addEventListener("click",(e)=>{
  if(window.innerWidth<=600){
  if(!menuBar.contains(e.target) && !rightHeader.contains(e.target)){ // event.target --> Clicked. is outside both of the menubar and rightHeader.
    rightHeader.style.display = "none";
    menuBar.style.display="inline-block";
  }
}
});

if(menuBar){
menuBar.addEventListener("click",()=>{
 rightHeader.style.display="grid";
 menuBar.style.display="none";
});
}
window.addEventListener("resize",updateVisibility);

updateVisibility();





