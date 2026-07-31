var nameInput = document.getElementById("contactName");
var avatarImg = "";
var phoneInput = document.getElementById("contactPhone");
var emailInput = document.getElementById("contactEmail");
var addressInput = document.getElementById("contactAddress");
var groupSelect = document.getElementById("contactGroup");
var notesInput = document.getElementById("contactNotes");
var favoriteCheck = document.getElementById("favoriteCheck");
var emergencyCheck = document.getElementById("emergencyCheck");
var searchInput = document.getElementById("searchInput");
var photoInput = document.getElementById("photoInput");
var photoPreviewInput = document.getElementById("photoPreview");
var noFavorites = document.getElementById("noFavorites");
var noEmergency = document.getElementById("noEmergency");

var currentIndex = -1;
var contactList = []

var regex = {

    contactName: /^[A-Za-z]{3,20}( [A-Za-z]{3,20})*$/,

    contactPhone: /^01[0125][0-9]{8}$/,

    contactEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,

};

contactList = JSON.parse(localStorage.getItem('ContactListArray')) || [];
displayContact()
updateDashboard();
displayFavorites();
displayEmergency();

function addContact() {
    if (currentIndex != -1) {
        updateContact();
        return;
    }

    if (nameInput.value.trim() == "") {

        Swal.fire({
            icon: "warning",
            title: "Name Required",
            text: "Please enter the contact name."
        });

        return;
    }

    if (phoneInput.value.trim() == "") {

        Swal.fire({
            icon: "warning",
            title: "Phone Required",
            text: "Please enter the phone number."
        });

        return;
    }

    if (emailInput.value.trim() == "") {

        Swal.fire({
            icon: "warning",
            title: "Email Required",
            text: "Please enter the email address."
        });

        return;
    }

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].phone == phoneInput.value) {

            Swal.fire({
                icon: "error",
                title: "Duplicate Phone",
                text: "This phone number already exists."
            });

            return;
        }

    }

    var contact = {
        name: nameInput.value,
        avatar: avatarImg,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        group: groupSelect.value,
        notes: notesInput.value,
        favoriteCheck: favoriteCheck.checked,
        emergencyCheck: emergencyCheck.checked,
    }

    if(

        validate(nameInput)
        &&
        validate(phoneInput)
        &&
        validate(emailInput)

    ) {

        contactList.push(contact);

}

    localStorage.setItem('ContactListArray', JSON.stringify(contactList));

    Swal.fire({
    icon: "success",
    title: "Added Successfully",
    text: "The contact has been added successfully.",
    timer: 1500,
    showConfirmButton: false
});

    clearForm()

    displayContact()

    updateDashboard()

    displayFavorites();

    displayEmergency();

}

function clearForm() {
    nameInput.value = ""
    phoneInput.value = ""
    emailInput.value = ""
    addressInput.value = ""
    groupSelect.value = ""
    notesInput.value = ""
    favoriteCheck.value = false;
    emergencyCheck.value = false;
    avatarImg = "";
    photoInput.value = "";
    photoPreview.innerHTML = "";
}

function displayContact() {
    var box = '';

    if (contactList.length == 0) {
        document.getElementById("contactsContainer").classList.remove("d-none");
    } else {
        document.getElementById("contactsContainer").classList.add("d-none");
    }

    for (var i = 0; i < contactList.length; i++) {

        box += `
        <div class="col-lg-6">
                            <div class="card contact-card border-0 mt-3">
                                <div class="card-body p-3">
                                    <div class="d-flex">
                                        <div class="position-relative">
                                            <div class="avatar" id="contactAvatar" style="background:${getAvatar(contactList[i].name)}">
                                                <img id="avatarImage" class="w-100 h-100 object-fit-cover d-none" src="${contactList[i].avatar}">
                                                <span class="avatarLetter">${contactList[i].avatar ? `
                                                    <img src = "${contactList[i].avatar}">
                                                    ` : `${getInitials(contactList[i].name)}`}</span>
                                            </div>
                                            <span class="favorite-badge ${contactList[i].favoriteCheck == true ? "d-inline-flex" : "d-none"}">
                                                <i class="fa-solid fa-star"></i>
                                            </span>
                                            <span class="emergency-badge ${contactList[i].emergencyCheck == true ? "d-inline-flex" : "d-none"}">
                                                <i class="fa-solid fa-heart-pulse"></i>
                                            </span>
                                        </div>
                                        <div class="ms-3 flex-grow-1">
                                            <h6 class="fw-bold mb-1">
                                                ${contactList[i].name}
                                            </h6>
                                            <div class="info-item">
                                                <div class="icon phone">
                                                    <i class="fa-solid fa-phone"></i>
                                                </div>
                                                <span>${contactList[i].phone}</span>
                                            </div>
                                            <div class="info-item">
                                                <div class="icon mail">
                                                    <i class="fa-solid fa-envelope"></i>
                                                </div>
                                                <span>${contactList[i].email}</span>
                                            </div>
                                            <div class="info-item">
                                                <div class="icon location">
                                                    <i class="fa-solid fa-location-dot"></i>
                                                </div>
                                                <span>${contactList[i].address}</span>
                                            </div>
                                            <div class="mt-2 d-flex gap-2">
                                                <span class="badge bg-primary-subtle text-primary ${contactList[i].group == "" ? "d-none" : "d-inline-flex"}">
                                                ${contactList[i].group}
                                                </span>
                                                <span class="badge bg-danger-subtle text-danger ${contactList[i].emergencyCheck == true ? "d-inline-flex" : "d-none"}">
                                                    <i class="fa-solid fa-heart-pulse me-1"></i>
                                                    Emergency
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-white border-top p-2">
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex gap-2">
                                            <button class="action-btn success">
                                                <i class="fa-solid fa-phone"></i>
                                            </button>
                                            <button class="action-btn purple">
                                                <i class="fa-solid fa-envelope"></i>
                                            </button>
                                        </div>
                                        <div class="d-flex gap-2">
                                            <button class="action-btn ${contactList[i].favoriteCheck ? "warning" : "gray"}"onclick="toggleFavorite(${i})">
                                                <i class="fa-solid fa-star"></i>
                                            </button>
                                            <button class="action-btn ${contactList[i].emergencyCheck ? "danger" : "gray"}"onclick="toggleEmergency(${i})">
                                                <i class="fa-solid fa-heart-pulse"></i>
                                            </button>
                                            <button class="action-btn gray" onclick="setUpdate(${i})" data-bs-toggle="modal" data-bs-target="#contactModal">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button class="action-btn gray" onclick="deletContact(${i})">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        `
    }

    document.getElementById('rowData').innerHTML = box;
}

function deletContact(index) {
    contactList.splice(index, 1)

    localStorage.setItem('ContactListArray', JSON.stringify(contactList));

    displayContact()

    updateDashboard()

    displayFavorites();

    displayEmergency();

    console.log(contactList)
}

function searchContact() {
    var textSearch = searchInput.value

    var box = '';

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].name.toLowerCase().includes(textSearch.toLowerCase())
            || contactList[i].email.toLowerCase().includes(textSearch.toLowerCase())
            || contactList[i].phone.toLowerCase().includes(textSearch.toLowerCase())
        )

            box += `
        <div class="col-lg-6">
                            <div class="card contact-card border-0 mt-3">
                                <div class="card-body p-3">
                                    <div class="d-flex">
                                        <div class="position-relative">
                                            <div class="avatar" id="contactAvatar" style="background:${getAvatar(contactList[i].name)}">
                                                <img id="avatarImage" class="w-100 h-100 object-fit-cover d-none" src="${contactList[i].avatar}">
                                                <span class="avatarLetter">${contactList[i].avatar ? `
                                                    <img src = "${contactList[i].avatar}">
                                                    ` : `${getInitials(contactList[i].name)}`}</span>
                                            </div>
                                            <span class="favorite-badge ${contactList[i].favoriteCheck == true ? "d-inline-flex" : "d-none"}">
                                                <i class="fa-solid fa-star"></i>
                                            </span>
                                            <span class="emergency-badge ${contactList[i].emergencyCheck == true ? "d-inline-flex" : "d-none"}">
                                                <i class="fa-solid fa-heart-pulse"></i>
                                            </span>
                                        </div>
                                        <div class="ms-3 flex-grow-1">
                                            <h6 class="fw-bold mb-1">
                                                ${contactList[i].name}
                                            </h6>
                                            <div class="info-item">
                                                <div class="icon phone">
                                                    <i class="fa-solid fa-phone"></i>
                                                </div>
                                                <span>${contactList[i].phone}</span>
                                            </div>
                                            <div class="info-item">
                                                <div class="icon mail">
                                                    <i class="fa-solid fa-envelope"></i>
                                                </div>
                                                <span>${contactList[i].email}</span>
                                            </div>
                                            <div class="info-item">
                                                <div class="icon location">
                                                    <i class="fa-solid fa-location-dot"></i>
                                                </div>
                                                <span>${contactList[i].address}</span>
                                            </div>
                                            <div class="mt-2 d-flex gap-2">
                                                <span class="badge bg-primary-subtle text-primary ${contactList[i].group == "" ? "d-none" : "d-inline-flex"}">
                                                ${contactList[i].group}
                                                </span>
                                                <span class="badge bg-danger-subtle text-danger ${contactList[i].emergencyCheck == true ? "d-inline-flex" : "d-none"}">
                                                    <i class="fa-solid fa-heart-pulse me-1"></i>
                                                    Emergency
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-white border-top p-2">
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex gap-2">
                                            <button class="action-btn success">
                                                <i class="fa-solid fa-phone"></i>
                                            </button>
                                            <button class="action-btn purple">
                                                <i class="fa-solid fa-envelope"></i>
                                            </button>
                                        </div>
                                        <div class="d-flex gap-2">
                                            <button class="action-btn warning">
                                                <i class="fa-solid fa-star"></i>
                                            </button>
                                            <button class="action-btn danger">
                                                <i class="fa-solid fa-heart-pulse"></i>
                                            </button>
                                            <button class="action-btn gray" onclick="setUpdate(${i})">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button class="action-btn gray" onclick="deletContact(${i})">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        `
    }

    document.getElementById('rowData').innerHTML = box;
}

function getAvatar(name) {
    var colors = [
        "linear-gradient(135deg, #2563EB, #1D4ED8)",
        "linear-gradient(135deg, #16A34A, #15803D)",
        "linear-gradient(135deg, #F97316, #EA580C)",
        "linear-gradient(135deg, #DC2626, #B91C1C)",
        "linear-gradient(135deg, #7C3AED, #5B21B6)",
        "linear-gradient(135deg, #0891B2, #0E7490)",
        "linear-gradient(135deg, #A16207, #854D0E)",
        "linear-gradient(135deg, #DB2777, #BE185D)"
    ];

    var sum = 0;

    for (var i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }

    return colors[sum % colors.length];
}

function getInitials(name) {
    if (!name) return "";

    var words = name.trim().split(" ").filter(word => word);

    if (words.length === 0) return "";

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}

photoInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = function () {
        avatarImg = reader.result
        photoPreview.innerHTML = `
        <img src="${avatarImg}" alt="avatar" class="w-100 h-100 object-fit-cover">
        `
    }
})

function setUpdate(index) {

    currentIndex = index;

    nameInput.value = contactList[index].name;
    phoneInput.value = contactList[index].phone;
    emailInput.value = contactList[index].email;
    addressInput.value = contactList[index].address;
    groupSelect.value = contactList[index].group;
    notesInput.value = contactList[index].notes;
    favoriteCheck.checked = contactList[index].favoriteCheck;
    emergencyCheck.checked = contactList[index].emergencyCheck;

    avatarImg = contactList[index].avatar;

    photoPreview.innerHTML = avatarImg
        ? `<img src="${avatarImg}" class="w-100 h-100 object-fit-cover">`
        : "";

}

function updateContact() {

    contactList[currentIndex] = {
        name: nameInput.value,
        avatar: avatarImg || contactList[currentIndex].avatar,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        group: groupSelect.value,
        notes: notesInput.value,
        favoriteCheck: favoriteCheck.checked,
        emergencyCheck: emergencyCheck.checked,
    };

    localStorage.setItem("ContactListArray", JSON.stringify(contactList));

    displayContact();

    updateDashboard();

    displayFavorites();

    displayEmergency();

    clearForm();

    currentIndex = -1;
}

function updateDashboard() {

    var favoriteCount = 0;
    var emergencyCount = 0;

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].favoriteCheck) {
            favoriteCount++;
        }

        if (contactList[i].emergencyCheck) {
            emergencyCount++;
        }

    }

    document.getElementById("totalContacts").innerHTML = contactList.length;

    document.getElementById("favoriteCount").innerHTML = favoriteCount;

    document.getElementById("emergencyCount").innerHTML = emergencyCount;
}

function displayFavorites() {

    var box = "";
    var count = 0;

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].favoriteCheck) {
            count ++;

            box += `
<div class="favorite-card d-flex justify-content-between align-items-center p-3 rounded-4 mb-3">
    <div class="d-flex align-items-center">
        <div class="favorite-avatar"
            style="background:${getAvatar(contactList[i].name)}">
            ${contactList[i].avatar
                    ? `<img src="${contactList[i].avatar}" class="w-100 h-100 rounded-3 object-fit-cover">`
                    : getInitials(contactList[i].name)
                }
        </div>
        <div class="ms-3">
            <h6 class="mb-0 fw-bold">${contactList[i].name}</h6>
            <small class="text-secondary">${contactList[i].phone}</small>
        </div>
    </div>
    <button class="call-btn">
        <i class="fa-solid fa-phone"></i>
    </button>
</div>
`;
        }

    }

    document.getElementById("favoriteList").innerHTML = box;

    if (count == 0) {
        noFavorites.classList.remove("d-none");
    } else {
        noFavorites.classList.add("d-none");
    }
}

function displayEmergency() {

    var box = "";
    var count = 0;

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].emergencyCheck) {

            count++;

            box += `
            <div class="emergency-card d-flex justify-content-between align-items-center p-3 rounded-4 mb-3">

                <div class="d-flex align-items-center">

                    <div class="emergency-avatar"
                        style="background:${getAvatar(contactList[i].name)}">

                        ${contactList[i].avatar
                            ? `<img src="${contactList[i].avatar}" class="w-100 h-100 rounded-3 object-fit-cover">`
                            : getInitials(contactList[i].name)
                        }

                    </div>

                    <div class="ms-3">
                        <h6 class="mb-0 fw-bold">${contactList[i].name}</h6>
                        <small class="text-secondary">${contactList[i].phone}</small>
                    </div>

                </div>

                <button class="call-btn-emergency">
                    <i class="fa-solid fa-phone"></i>
                </button>

            </div>
            `;
        }

    }

    document.getElementById("emergencyList").innerHTML = box;

    if (count == 0) {
        noEmergency.classList.remove("d-none");
    } else {
        noEmergency.classList.add("d-none");
    }

}

function toggleFavorite(index) {

    contactList[index].favoriteCheck =
        !contactList[index].favoriteCheck;

    localStorage.setItem(
        "ContactListArray",
        JSON.stringify(contactList)
    );

    displayContact();
    updateDashboard();
    displayFavorites();

}

function toggleEmergency(index) {

    contactList[index].emergencyCheck =
        !contactList[index].emergencyCheck;

    localStorage.setItem(
        "ContactListArray",
        JSON.stringify(contactList)
    );

    displayContact();
    updateDashboard();
    displayEmergency();

}

function validate(element){

    if(regex[element.id].test(element.value)){

        element.classList.add("is-valid");
        element.classList.remove("is-invalid");

        return true;

    }

    else{

        element.classList.add("is-invalid");
        element.classList.remove("is-valid");

        return false;

    }

}