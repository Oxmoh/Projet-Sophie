const fetchApi = async (url) => {   // Appel immédiat de la fonction asynchrone anonyme
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Une erreur est survenue", error);
    return null;
  }
};



// Fonction pour créer un élément HTML avec du texte à l'intérieur
function createElemWithText(tag, text) {
  const elem = document.createElement(tag); // Crée l'élément HTML
  elem.innerText = text; // Définit le texte de l'élément
  return elem; // Retourne l'élément créé
}

// Fonction pour créer une figure (élément <figure>) avec une image et une légende
function createFigure({ id, imageUrl, title }) {
  const figure = document.createElement("figure");
  figure.dataset.id = id; // Stocke l'ID dans l'attribut data-id de la figure

  const img = document.createElement("img"); // Crée l'élément image
  img.src = imageUrl; // Définit l'URL de l'image

  const caption = createElemWithText("figcaption", title); // Crée la légende

  figure.append(img, caption); // Ajoute l'image et la légende à la figure
  return figure; // Retourne la figure créée
}



const displayWorks = (works, container) => {
  container.innerHTML = "";
  works.forEach((work) => container.appendChild(createFigure(work)));
};

// Fonction pour configurer et ajouter des boutons de filtre basés sur les catégories des travaux
function setupButtons(works, filterContainer, displayContainer) {
  // Crée un bouton qui permet d'afficher tous les travaux
  const btnAll = createElemWithText("button", "Tous");
  // Ajoute un écouteur d'événement sur le bouton pour afficher tous les travaux lorsqu'il est cliqué
  btnAll.addEventListener("click", () => displayWorks(works, displayContainer));
  // Ajoute le bouton au conteneur de filtres
  filterContainer.appendChild(btnAll);

  // Détermine les catégories uniques parmi tous les travaux pour éviter les doublons
  const uniqueCategories = [
    ...new Set(works.map((work) => work.category.name)),
  ];

  // Pour chaque catégorie unique trouvée, crée un nouveau bouton de filtre
  uniqueCategories.forEach((category) => {
    // Crée un bouton avec le nom de la catégorie
    const btn = createElemWithText("button", category);
    // Ajoute un écouteur d'événement sur le bouton pour filtrer et afficher les travaux de cette catégorie lorsqu'il est cliqué
    btn.addEventListener("click", () => {
      // Filtre les travaux pour ne garder que ceux qui appartiennent à la catégorie cliquée
      const filteredWorks = works.filter(
        (work) => work.category.name === category
      );
      // Affiche les travaux filtrés dans le conteneur d'affichage
      displayWorks(filteredWorks, displayContainer);
    });
    // Ajoute le bouton de catégorie au conteneur de filtres
    filterContainer.appendChild(btn);
  });
}


// Explications supplémentaires :

// works : un tableau contenant les données de tous les travaux, où chaque travail a une catégorie.
// filterContainer : l'élément DOM (Document Object Model) dans lequel les boutons de filtre seront ajoutés. Cela permet à l'utilisateur de choisir les travaux à afficher en fonction de la catégorie.
// displayContainer : l'élément DOM où les travaux filtrés seront affichés.
// createElemWithText : une fonction qui crée un élément HTML (dans ce cas, un bouton) et définit son texte. Cette fonction est appelée pour créer le bouton "Tous" et les boutons pour chaque catégorie unique.
// displayWorks : une fonction appelée pour afficher les travaux dans le displayContainer. Elle prend en compte le filtre appliqué par les boutons de catégorie.
// Ce code utilise des fonctions d'ordre supérieur comme .map(), .filter(), et .forEach() pour travailler avec des tableaux, ainsi que l'utilisation de Set pour filtrer les valeurs uniques, ce qui sont des concepts importants en JavaScript.

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

// Initialisation
async function recupererTousMesProjets() {
  console.log("Page entièrement chargée");

  const works = await fetchApi("http://localhost:5678/api/works");
  const sectionProjet = document.querySelector(".myprojets");
  if (works && sectionProjet)
    displayWorks(works, sectionProjet);

  const filtresDiv = document.querySelector(".filtres");
  if (works && filtresDiv) setupButtons(works, filtresDiv, sectionProjet);
}
recupererTousMesProjets();

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

// LOGIN

// Poste des données à l'API
const postToAPI = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { data: await response.json(), status: response.status };
  } catch (error) {
    console.error("Une erreur est survenue", error);
    return null;
  }
};

// Cette fonction est appelée lors de la soumission du formulaire de connexion
async function handleFormSubmission(event) {
  // Empêche le comportement par défaut du formulaire (rechargement de la page)
  event.preventDefault();

  // Récupère les valeurs saisies par l'utilisateur dans les champs du formulaire
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;

  // Envoie une requête asynchrone à l'API pour tenter de connecter l'utilisateur
  const response = await postToAPI("http://localhost:5678/api/users/login", {
    email,
    password,
  });

  // Si la réponse est positive (statut 200), stocke les informations de l'utilisateur et redirige vers la page d'accueil
  if (response && response.status === 200) {
    console.log("connexion utilisateur réussie");
    // Stocke l'identifiant de l'utilisateur et le token dans le stockage local du navigateur
    localStorage.setItem("user", JSON.stringify(response.data.userId));
    localStorage.setItem("token", response.data.token);
    // Redirige l'utilisateur vers la page d'accueil
    location.href = "homepage.html";
  } else {
    // Si les identifiants sont incorrects, affiche un message d'erreur
    document.getElementById("error-message").textContent =
      "Identifiant ou mot de passe incorrect";
  }
}

// Sélectionne le formulaire de connexion dans le DOM
const form = document.querySelector(".contact2");
// Si le formulaire existe, lui ajoute un écouteur d'événements pour gérer sa soumission
if (form) {
  form.addEventListener("submit", handleFormSubmission);
}


// Se déconnecter du site
// const tokenAuth = localStorage.getItem("token");
// const handleLogout = () => {
//   localStorage.removeItem("user");
//   localStorage.removeItem("token");
//   alert("Vous avez été déconnecté.");
//   location.reload();
// }

// function resetChamps() {
//   const resetEmail = document.querySelector("#login-email");
//   const resetPassword = document.querySelector("#login-password");
//   if (resetEmail && resetPassword) {
//     resetEmail.value = "";
//     resetPassword.value = "";
//   }
// };

// if (tokenAuth) {
//   document.querySelector(".login").textContent = "logout";
// }

// const disconect = document.querySelector(".menu");
// if (tokenAuth) {
//   disconect.addEventListener("click", handleFormSubmission, handleLogout, resetChamps);
// }



// Fonction appelée pour déconnecter l'utilisateur
const handleLogout = () => {
  // Supprime les informations de l'utilisateur et le token d'authentification du stockage local
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // Recharge la page pour refléter l'état déconnecté de l'utilisateur
  location.href = "homepage.html";
  // Réinitialise les champs du formulaire de connexion pour effacer les entrées précédentes
  const emailElem = document.getElementById("login-email");
  const passwordElem = document.getElementById("login-password");
  if (emailElem && passwordElem) {
    emailElem.value = "";
    passwordElem.value = "";
  }
};



// Vérifie si un token d'authentification est présent et ajuste l'interface en conséquence
function checkTokenLogin() {
  // Récupère le token d'authentification du stockage local
  const tokenAuth = localStorage.getItem("token");
  // Sélectionne différents éléments de l'interface
  const loginLink = document.querySelector(".login");
  const adminBar = document.getElementById("admin-bar");
  const allFilterBtn = document.querySelector(".filtres");
  const modifierBtn = document.getElementById("edit-mod-btn");

  // Si un token est présent, ajuste l'interface pour un utilisateur connecté
  if (tokenAuth) {
    loginLink.textContent = "logout"; // Change le texte du lien de connexion en "logout"
    // Rend visible la barre d'administration et le bouton de modification, et cache le bouton de filtre
    if (adminBar) adminBar.classList.remove("hidden");
    if (allFilterBtn) allFilterBtn.classList.add("hidden");
    if (modifierBtn) modifierBtn.classList.remove("hidden");
    // Ajoute un écouteur d'événement pour gérer la déconnexion
    loginLink.addEventListener("click", handleLogout);
  } else {
    // Ajuste l'interface pour un utilisateur non connecté
    loginLink.textContent = "login"; // Garde ou remet le texte du lien en "login"
    // Cache la barre d'administration et le bouton de modification
    if (adminBar) adminBar.classList.add("hidden");
    if (modifierBtn) modifierBtn.parentNode.removeChild(modifierBtn);
  }
}

checkTokenLogin();


// Sélection de la modal pour ensuite l'afficher lors du click ou la retirer

function myModal(isVisible) {
  const editModal = document.getElementById("edit-modal");
  editModal.classList.toggle("mystyle");
  if (editModal) {
    // Ajoute ou retire la classe "hidden" en fonction de l'argument isVisible
    editModal.classList.toggle("hidden", !isVisible);
  }
}

// Fonction pour ouvrir la modal et afficher les projets existants
// function openModal() {
//   const allEditBtn = document.querySelectorAll(".open-modal");
//   allEditBtn.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       myModal(true); // Affiche la modale


//   // Récupérer les images en les clonant pour les afficher dans la modal
//   const imageModal = () => {
//     const existingProjects = document.getElementById("existing-projects");
//     const clone = document.querySelector(".myprojets").cloneNode(true);
//     existingProjects.appendChild(clone);
//   };
//   imageModal();
// });
// });
// }
// Pour chaque bouton, ajoute un écouteur d'événement qui ouvre la modale

function openModal() {
  // Sélectionne tous les boutons qui ouvrent la modale
  const allEditBtn = document.querySelectorAll(".open-modal");
  // Pour chaque bouton, ajoute un écouteur d'événement qui ouvre la modale

  allEditBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      myModal(true); // Affiche la modale

      // Clone le contenu existant des projets pour l'afficher dans la modale

      const existingProjects = document
        .querySelector(".projets")
        .cloneNode(true);
      const modalProjects = document.getElementById("existing-projects");
      modalProjects.innerHTML = ""; // Vide le contenu actuel
      // Pour chaque image dans les projets clonés, crée un conteneur et l'ajoute à la modale
      existingProjects.querySelectorAll("img").forEach((img) => {
        const imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "img-container");
        imgContainer.setAttribute("data-id", img.closest("figure").dataset.id);
        imgContainer.innerHTML = `${img.outerHTML}<button class="delete-icon"><i class="fa-solid fa-trash-can"></i></button>`;
        modalProjects.appendChild(imgContainer);
      });
    });
  });
}

openModal();


// function closeModal() {
//   const closeModalBtn = document.getElementById("close-modal");
//   closeModalBtn.addEventListener("click", function(){
//     myModal(false);
//   });
// };



// function closeModalOnClickOutside() {
//   const modal = document.querySelector(".modal-content")
//   document.addEventListener("click", function(event) {
//     // Vérifie si le clic n'est pas à l'intérieur de la modal
//     if (!modal.contains(event.target)) {
//       myModal(false) // Ferme la modal
//       };
//     });
//   };


// closeModalOnClickOutside();
// closeModal();

const closeModal = () => {
  // Sélectionne les boutons de fermeture de la modale
  const closeModalButtons = document.querySelectorAll(
    "#close-modal", "#close-modal-form");
  // Ajoute un écouteur d'événement sur chaque bouton pour fermer la modale
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => myModal(false));
  });
  const editModal = document.getElementById("edit-modal");
  // Ferme la modale si l'utilisateur clique en dehors du contenu de la modale
  if (editModal) {
    editModal.addEventListener("click", (event) => {
      const modalContent = document.querySelector(".modal-content");
      // const modalContentForm = document.querySelector(".modal-content-form");
      if (
        !modalContent.contains(event.target)
        // &&
        // !modalContentForm.contains(event.target)
      ) {
        myModal(false);
      }
    });
  }
};

closeModal();


const modalForm = () => {
  const addPhoto = document.getElementById("add-photo");
  const modalContent = document.querySelector(".modal-content");
  const modalContentForm = document.querySelector(".modal-content-form");
  const backFormModal = document.getElementById("back-form-modal");
  if (addPhoto) {
    addPhoto.addEventListener("click", () => {
      modalContent.classList.add("hidden");
      modalContentForm.classList.remove("hidden");
    });
  };
  if (backFormModal) {
    backFormModal.addEventListener("click", () => {
      modalContentForm.classList.add("hidden");
      modalContent.classList.remove("hidden");
    });
};
};

modalForm();

