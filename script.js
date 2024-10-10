document.getElementById('view-more-btn').onclick = () => {
  document.getElementById('main-section').scrollIntoView({behavior:'smooth'});
};

// Fetch categories and generate buttons
fetch('https://openapi.programming-hero.com/api/peddy/categories')
  .then(response => response.json())
  .then(data => {
    const categories = data.categories;
    const buttonContainer = document.getElementById('category-buttons');

    // Clear existing content in the container
    buttonContainer.innerHTML = '';

    categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'btn text-3xl py-2 px-6 rounded-3xl flex items-center font-normal';

      // Create image element for the icon
      const icon = document.createElement('img');
      icon.src = category.category_icon;
      icon.alt = `${category.category} icon`;
      icon.className = 'w-8 h-8 mr-2';

      // Create text node for the category name
      const textNode = document.createTextNode(category.category);

      // Append icon and text to the button
      button.appendChild(icon);
      button.appendChild(textNode);

      // Add click event to fetch pets by category
      button.addEventListener('click', () => fetchPetsByCategory(category.category));

      // Append button to the container
      buttonContainer.appendChild(button);
    });

    // Show all pets when the page loads
    fetchPetsByCategory(); // Call the function without a category to display all pets
  })
  .catch(error => console.error('Error fetching categories:', error));

function fetchPetsByCategory(category) {

  document.getElementById("pets-spinner").classList.remove("hidden");

  fetch('https://openapi.programming-hero.com/api/peddy/pets')
    .then(response => response.json())
    .then(petData => {

      // Hide the spinner after data is fetched
      document.getElementById("pets-spinner").classList.add("hidden");

      const pets = petData.pets;
      const petContainer = document.getElementById('category-pets');
      petContainer.innerHTML = ''; // Clear previous pets

      // If no category is selected, show all pets
      if (!category) {
        pets.forEach(pet => createPetCard(pet, petContainer));
        return; // Exit the function early if no category is selected
      }

      // Filter pets by the selected category
      const filteredPets = pets.filter(pet => pet.category === category);

      // Check for "Bird" category
      if (category === "Bird") {
        if (filteredPets.length === 0) {
          // If no pets found for birds, show default image and text
          const noPetCard = document.createElement('div');
          noPetCard.className = 'col-span-full flex flex-col items-center justify-center h-full w-full p-4 border rounded-lg shadow-lg'; // Span full width

          const noPetImage = document.createElement('img');
          noPetImage.src = './images/error.webp'; // Replace with your image path
          noPetImage.alt = 'No bird information';
          noPetImage.className = 'max-w-full max-h-60 object-cover mb-4'; // Limit the image height and maintain aspect ratio

          const noPetheading = document.createElement('h1');
          noPetheading.className = 'text-xl mt-2 font-bold text-center'; // Center the text
          noPetheading.textContent = 'No Information Available';

          const noPetText = document.createElement('p');
          noPetText.className = 'text-lg mt-2 text-center'; // Center the text
          noPetText.textContent = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at';

          // Append elements to the noPetCard
          noPetCard.appendChild(noPetImage);
          noPetCard.appendChild(noPetheading);
          noPetCard.appendChild(noPetText);

          // Append noPetCard to the container
          petContainer.appendChild(noPetCard);
          return; // Exit the function early
        }
      }

      // Display each pet in the filtered list if there are any pets
      filteredPets.forEach(pet => createPetCard(pet, petContainer));

      // After displaying pets, attach the sorting functionality
      attachSortByPriceFunctionality(petContainer);
    })
    .catch(error => console.error('Error fetching pets:', error));
}

// Function to create a pet card
function createPetCard(pet, container) {
  const petCard = document.createElement('div');
  petCard.className = 'p-4 border rounded-lg shadow-lg flex flex-col';

  // Pet Image
  const petImage = document.createElement('img');
  petImage.src = pet.image;
  petImage.alt = `${pet.pet_name} image`;
  petImage.className = 'w-full h-48 object-cover rounded-md mb-2'; // Adjusted for spacing below

  // Pet Name
  const petName = document.createElement('h3');
  petName.className = 'text-2xl font-bold mt-2'; // Bold pet name
  petName.textContent = pet.pet_name;

  // Breed Info
  const breedInfo = document.createElement('p');
  breedInfo.className = 'flex items-center mt-2'; // Flex for icon and text
  breedInfo.innerHTML = `<i class="fa-solid fa-paw mr-1"></i> Breed: ${pet.breed || 'Unknown'}`;

  // Birth Info
  const birthInfo = document.createElement('p');
  birthInfo.className = 'flex items-center mt-1'; // Flex for icon and text
  birthInfo.innerHTML = `<i class="fa-solid fa-calendar-alt mr-1"></i> Birth: ${pet.birth || 'Unknown'}`;

  // Gender Info
  const genderInfo = document.createElement('p');
  genderInfo.className = 'flex items-center mt-1'; // Flex for icon and text
  genderInfo.innerHTML = `<i class="fa-solid fa-venus-mars mr-1"></i> Gender: ${pet.gender || 'Unknown'}`;

  // Price Info
  const priceInfo = document.createElement('p');
  priceInfo.className = 'flex items-center mt-1'; // Flex for icon and text
  priceInfo.innerHTML = `<i class="fa-solid fa-dollar-sign mr-1"></i> Price: $${pet.price || 'Unknown'}`;

  // Button Row
  const buttonRow = document.createElement('div');
  buttonRow.className = 'flex justify-between gap-1 mt-4'; // Space out buttons evenly

  // Like Button
  const likeButton = document.createElement('button');
  likeButton.className = 'btn text-btnPrimary rounded-md px-3 py-2 flex items-center';
  likeButton.innerHTML = `<i class="fa-solid fa-thumbs-up mr-1"></i> Like`;

  // Adopt Button
  const adoptButton = document.createElement('button');
  adoptButton.className = 'btn text-btnPrimary rounded-md px-3 py-2 flex items-center';
  adoptButton.innerHTML = `<i class="fa-solid fa-heart mr-1"></i> Adopt`;

  // Details Button
  const detailsButton = document.createElement('button');
  detailsButton.className = 'btn text-btnPrimary rounded-md px-3 py-2 flex items-center';
  detailsButton.innerHTML = `<i class="fa-solid fa-info-circle mr-1"></i> Details`;

  // Append buttons to the button row
  buttonRow.appendChild(likeButton);
  buttonRow.appendChild(adoptButton);
  buttonRow.appendChild(detailsButton);

  // Append all elements to the pet card
  petCard.appendChild(petImage);
  petCard.appendChild(petName);
  petCard.appendChild(breedInfo);
  petCard.appendChild(birthInfo);
  petCard.appendChild(genderInfo);
  petCard.appendChild(priceInfo);
  petCard.appendChild(buttonRow);

  // Append pet card to the container
  container.appendChild(petCard);


  // Adopt Button event listener
  // Event listener for the adopt button
  adoptButton.addEventListener('click', () => {
    // Create a fresh modal container each time
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white p-6 rounded-lg shadow-lg text-center';

    // Add content to the modal
    modalContent.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4">Congratulations!</h2>
      <p class="text-lg">Your adoption is being processed.</p>
      <p class="text-sm mt-2">This modal will close in <span id="countdown">3</span> seconds.</p>
    `;

    // Append modal content to modal container
    modal.appendChild(modalContent);

    // Append modal to the body
    document.body.appendChild(modal);

    // Countdown logic
    let countdown = 3;
    const countdownElement = modalContent.querySelector('#countdown');

    const countdownInterval = setInterval(() => {
      countdown--;
      countdownElement.textContent = countdown;

      if (countdown === 0) {
        clearInterval(countdownInterval);
        // Remove modal after countdown ends
        modal.remove();
        // Disable the adopt button and change its text
        adoptButton.disabled = true;
        adoptButton.textContent = 'Adopted';
      }
    }, 1000);
  });
  

  // Inside the createPetCard function, add an event listener for the like button
likeButton.addEventListener('click', () => {
    const likedImagesContainer = document.getElementById('liked-images');
  
    // Create an image element for the liked pet
    const likedPetImage = document.createElement('img');
    likedPetImage.src = pet.image; // Use the pet's image source
    likedPetImage.alt = `${pet.pet_name} liked image`;
    likedPetImage.className = 'w-48 h-48 object-cover rounded-md'; // Set size and style
  
    // Append the liked pet image to the liked images container
    likedImagesContainer.appendChild(likedPetImage);
  });
  
  // Details Button event listener
detailsButton.addEventListener('click', () => {
  // Create modal container for details
  const detailsModal = document.createElement('div');
  detailsModal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50';

  // Modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white p-6 rounded-lg shadow-lg text-center';

  // Add content to the modal (similar to the card, but with extra details info)
  modalContent.innerHTML = `
  <div class="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-w-lg">
          <img src="${pet.image}" alt="${pet.pet_name}" class="rounded-md mb-4 w-full object-cover">
          <h2 class="text-2xl font-semibold mb-4 text-left">${pet.pet_name}</h2>
          <p class="text-left"><i class="fa-solid fa-paw"></i> Breed: ${pet.breed || 'Unknown'}</p>
          <p class="text-left"><i class="fa-solid fa-calendar-alt"></i> Birth: ${pet.birth || 'Unknown'}</p>
          <p class="text-left"><i class="fa-solid fa-venus-mars"></i> Gender: ${pet.gender || 'Unknown'}</p>
          <p class="text-left"><i class="fa-solid fa-dollar-sign"></i> Price: $${pet.price || 'Unknown'}</p>
          
          <hr>
          <p class="mt-4 text-left break-words"><i class="fa-solid fa-info-circle"></i> Details: ${pet.pet_details || 'No additional details available'}</p>
          <button class="btn bg-btnPrimary text-white mt-6 w-full rounded-lg">Close</button>
      </div>
  </div>
`;



  // Append modal content to modal container
  detailsModal.appendChild(modalContent);

  // Append modal to body
  document.body.appendChild(detailsModal);

  // Close button functionality
  modalContent.querySelector('button').addEventListener('click', () => {
    detailsModal.remove();
  });
});

  
}

// Function to attach sorting functionality
function attachSortByPriceFunctionality(petContainer) {
  document.getElementById('sort-price-btn').addEventListener('click', () => {
    const petCards = Array.from(petContainer.children); // Get all pet cards

    // Sort the pet cards by price in descending order
    petCards.sort((a, b) => {
      // Assuming the price is in a <p> tag with the text "Price: $X"
      const priceA = parseFloat(a.querySelector('p:last-of-type').innerText.split('$')[1]) || 0; // Extract price for card A
      const priceB = parseFloat(b.querySelector('p:last-of-type').innerText.split('$')[1]) || 0; // Extract price for card B
      return priceB - priceA; // Sort in descending order
    });

    // Clear the current pet cards and append the sorted pet cards back
    petContainer.innerHTML = ''; // Clear the container
    petCards.forEach(card => petContainer.appendChild(card)); // Append sorted cards back
  });
}

// Inside the createPetCard function, add this like button event
// Select the container for liked images
// Liked Images Container
const likedImagesContainer = document.getElementById('liked-images');

// Function to handle like button click
likeButton.addEventListener('click', () => {
    const likedImage = document.createElement('img');
    likedImage.src = pet.image; // Use the image from the pet card
    likedImage.alt = `${pet.pet_name} liked image`;
    likedImage.className = 'w-full h-32 object-cover'; // Adjust size as needed

    // Create a container for the image to control its layout
    const imageContainer = document.createElement('div');
    imageContainer.className = 'flex'; // Center the image in the grid

    imageContainer.appendChild(likedImage);
});



