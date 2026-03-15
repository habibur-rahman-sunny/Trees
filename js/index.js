// DOM elements (get elements by id at the top for easy access)
const treesBtnSection = document.getElementById("trees-btn-section")
const productCardSection = document.getElementById("product-card-section")
const cartSection = document.getElementById("cart-section")
const allBtn = document.getElementById("all-btn")
const totalPrice = document.getElementById("total-price")
const spinnerSection = document.getElementById("spinner-section")
const dialogueModal = document.getElementById("my_modal_5");



// 1️⃣ Fetch categories from API and display buttons
const url = "https://openapi.programming-hero.com/api/categories";

const showMessage = async () => {
    const response = await  fetch(url)
    const jsObj = await response.json()
    displayBtn(jsObj.categories)
};

showMessage(); // call function on page load to show category buttons



// Display category buttons
const displayBtn = (arrayOfObjects) => {

  arrayOfObjects.forEach(object => {
    const div = document.createElement("div"); // create wrapper div for each button

    div.innerHTML = `
      <div>
        <button 
          id="button-${object.id}" 
          onclick="clickBtn(${object.id})" 
          class="p-2 bg-green-700 rounded-sm text-white  md:p-2 md:w-full md:text-start w-full md:bg-[#d7e4dc] md:text-black font-semibold"
        >
          ${object.category_name}
        </button>
      </div>
    `;
    treesBtnSection.appendChild(div); // add button to button section
  });
};



// 2️⃣ Fetch all plants from API and display them

const showMessages = () => {
  loadSpinner(true);
  const url = `https://openapi.programming-hero.com/api/plants`; // API endpoint for all plants

  fetch(url)
    .then(response => response.json())
    .then(jsObj => {

      // add 'active' class to the "All" button
      const initialBtn = document.getElementById("all-btn");
      initialBtn.classList.add("active");

      displayAllCard(jsObj.plants);
    })
    .catch((e) => console.log(e));
};

showMessages(); // show all products on page load



// Display all plant cards
const displayAllCard = (objectOfArray) => {
  productCardSection.innerText = ""; // clear previous cards

  objectOfArray.forEach(object => {
    const div = document.createElement("div"); // create card wrapper

    div.innerHTML = `
      <div class="w-60 bg-white rounded-xl shadow-xl p-4">

        <!-- Image -->
        <div class="bg-gray-300 h-36 rounded-lg">
          <img onclick="showModal(${object.id})"
              src="${object.image}" 
               alt="${object.name}" 
               class="w-full h-full object-cover rounded-lg" />
        </div>

        <!-- Title -->
        <h3 class="mt-3 font-semibold text-lg">
          ${object.name}
        </h3>

        <!-- Description -->
          <p class="text-sm text-gray-500 mt-1 line-clamp-2">
            ${object.description}
          </p>
          <button class="p-1 text-sm text-green-700 rounded-sm " onclick="showModal(${object.id})">see more</button>

        <!-- Category + Price -->
        <div class="flex justify-between items-center mt-3">
          <span class="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
            ${object.category}
          </span>

          <span class="font-semibold">
            ৳${object.price}
          </span>
        </div>

        <!-- Button -->
        <button onclick = "cardBtn(${object.id}, '${object.name}', ${object.price})" class="w-full mt-4 bg-green-700 text-white py-2 rounded-full"> 
          Add to Cart
        </button>

      </div>
    `;

    productCardSection.appendChild(div); // add card to product section
  });
  loadSpinner(false);
};



// All button
// Show all products when "All" clicked
allBtn.addEventListener("click", () => {
  removeActive();
  showMessages();
});



// 3️⃣ Show plants when a specific category button is clicked
const clickBtn = (id) => {
  loadSpinner(true);
  removeActive();

  // add active class to clicked button
  const clickBtn = document.getElementById(`button-${id}`);
  clickBtn.classList.add("active");

  const url = `https://openapi.programming-hero.com/api/category/${id}`; // API for specific category

  fetch(url)
    .then(response => response.json())
    .then(jsObj => displaySpecificCard(jsObj.plants))
    .catch((e) => console.log(e));
};

// Remove active class
const removeActive = () => {

  // select all category buttons
  const clickedButton = document.querySelectorAll("#trees-btn-section button");

  clickedButton.forEach(button => {
    button.classList.remove("active"); // remove active class from each button
  });

  allBtn.classList.remove("active"); // also remove from "All" button
};

// Display plants of specific category
const displaySpecificCard = (arrayOfObjects) => {
  productCardSection.innerText = ""; // clear previous cards
  arrayOfObjects.forEach(object => {
    const div = document.createElement("div"); // create card wrapper
    div.innerHTML = `
      <div class="w-60 bg-white rounded-xl shadow-xl p-4">
        <!-- Image -->
        <div class="bg-gray-300 h-36 rounded-lg">
          <img onclick="showModal(${object.id})"
          src="${object.image}" 
               alt="${object.name}" 
               class="w-full h-full object-cover rounded-lg" />
        </div>        
        <!-- Title -->
        <h3 class="mt-3 font-semibold text-lg">
          ${object.name}
        </h3>
        <!-- Description -->
          <p class="text-sm text-gray-500 mt-1 line-clamp-2">
            ${object.description}
          </p>
          <button class="p-1 text-sm text-green-700 rounded-sm " onclick="showModal(${object.id})">see more</button>
        <!-- Category + Price -->
        <div class="flex justify-between items-center mt-3">
          <span class="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
            ${object.category}
          </span>

          <span class="font-semibold">
            ৳${object.price}
          </span>
        </div>
        <!-- Button -->
        <button onclick = "cardBtn(${object.id}, '${object.name}', ${object.price})" class="w-full mt-4 bg-green-700 text-white py-2 rounded-full"> 
          Add to Cart
        </button>
      </div>
    `;
    productCardSection.appendChild(div); // add card to product section
  });
  loadSpinner(false);
};



// Cart data array
let cartArray = [];
function cardBtn (id, name, price){

  // check if the item already exists in cart
  const existingValue = cartArray.find((item) => (item.id === id));

  if(existingValue){
    existingValue.quantity += 1; // increase quantity if item already exists
  }else{
    cartArray.push({
      id,
      name,
      price,
      quantity:1,
    }) // add new item to cart
  }
  
  // console.log(cartArray);
  updateCart()
}



function updateCart() {
  cartSection.innerText = ""; // clear previous cart items
  let total = 0; // variable to store total cart price
  cartArray.forEach(item => { //👉 forEach loops through every item in cartArray and creates & adds a cart UI element for each item to the DOM.
      total += item.price * item.quantity; // calculate total price
      const div = document.createElement("div"); // create cart item div
      div.innerHTML = `
      <div class="w-11/12 mx-auto bg-violet-100 rounded-lg mb-3">
        <div class="flex justify-between p-4">
          <div class="space-y-1 font-medium">
            <h1>${item.name}</h1>
            <div>৳${item.price} × ${item.quantity}</div>
          </div>
          <div class="flex flex-col gap-1 justify-center font-medium">
            <button onclick = "removeCart(${item.id})" class="p-1 rounded-sm  bg-white delete">X</button>
            <h1>৳${item.price * item.quantity}</h1>
          </div>
        </div>
      </div>
  `;

      cartSection.appendChild(div) // add cart item to cart section
  });

  totalPrice.innerText = `৳${total}`; // update total price in UI
}



// Remove cart item
const removeCart = (id) => {
  const updateElements = cartArray.filter(item => item.id != id); //filter() returns a new array depends your condition.
  cartArray = updateElements ; //👉 It updates cartArray with the new filtered array (after deletion).
  updateCart() //👉 updateCart() = render the UI again using the latest cartArray data.
}


// loadSpinner
function loadSpinner(state) {
  if(state == true){
    spinnerSection.classList.remove("hidden")
    productCardSection.classList.add("hidden")
  }else{
    spinnerSection.classList.add("hidden")
    productCardSection.classList.remove("hidden")
  }
}

// Dialog modal
const showModal = (id) => {
    // modal open
    dialogueModal.showModal(); 

    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    fetch(url)
    .then(resp => resp.json())
    .then(objJs => displayInfoDetails(objJs.plants));
}

const displayInfoDetails = (object) => {
    // clear previous content
   dialogueModal.innerText = "";

    // create wrapper div
    const infoSection = document.createElement("div");

    // inject new content with same layout like your example
    infoSection.innerHTML = `
    <div class="modal-box max-w-[250px] max-h-[500px] md:max-w-[800px] p-3">
      <div class=" m-0 p-4 rounded-lg space-y-4">
        <!-- Image -->
        <div class=" rounded-lg overflow-hidden flex justify-center items-center h-60 md:h-55 ">
          <div class= "border  rounded-xl shadow-lg">
            <img src="${object.image}" 
               alt="${object.name}" 
               class=" max-w-[250px] max-h-[500px] md:max-w-[800px] h-auto object-cover" />
          </div>
        </div>

        <!-- Title -->
        <h1 class="font-bold text-xl">${object.name}</h1>

        <!-- Description -->
        <div class="flex flex-col gap-2">
          <p class="font-bold">Description</p>
          <p class="text-sm text-gray-500">${object.description}</p>
        </div>

        <!-- Category & Price -->
        <div class="flex justify-between items-center mt-2">
          <span class="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">${object.category}</span>
          <span class="font-semibold">৳${object.price}</span>
        </div>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-active btn-secondary bg-violet-600 border-violet-800 py-1">
            Close
          </button>
        </form>
      </div>
    </div>
    `;

    dialogueModal.appendChild(infoSection);
}



