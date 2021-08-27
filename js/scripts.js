// Business Logic for Address Book ------
function AddressBook() {
  this.contacts = {};
  this.currentId = 0;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts[contact.id] = contact;
};

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
};

AddressBook.prototype.findContact = function(id) {
  if (this.contacts[id] != undefined) {
    return this.contacts[id];
  }
  return false;
};

AddressBook.prototype.deleteContact = function(id) {
  if (this.contacts[id] === undefined) {
    return false;
  }
  delete this.contacts[id];
  return true;
};


// Business Logic for Contacts -------
function Contact(firstName, lastName, phoneNumber, workEmailAddress, personalEmailAddress) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
  this.emailAddresses = {"work": workEmailAddress, "home": personalEmailAddress};
}

Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
};

Contact.prototype.update = function(newName, newLastName, newPhoneNumber) {
  this.firstName = newName;
  this.lastName = newLastName;
  this.phoneNumber = newPhoneNumber;
  return this;
};

// User Interface Logic ---------
let addressBook = new AddressBook();

function displayContactDetails(addressBookToDisplay) {
  let contactsList = $("ul#contacts");
  let htmlForContactInfo = "";
  Object.keys(addressBookToDisplay.contacts).forEach(function(key) {
    const contact = addressBookToDisplay.findContact(key);
    htmlForContactInfo += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  });
  contactsList.html(htmlForContactInfo);
}

function attachContactListeners() {
  $("ul#contacts").on("mousedown", "li", function(event) {
    if(event.which === 3) {
      addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    displayContactDetails(addressBook);
    } else {
      showContact(this.id);
    }
  });

  $("#buttons").on("click", ".deleteButton", function() {
    addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    displayContactDetails(addressBook);
  });
  $(window).keypress(function(event) {
    console.log(event);
    if(event.which === 100) {
      addressBook.deleteContact(1);
    $("#show-contact").hide();
    displayContactDetails(addressBook);
    };
  });
}

function showContact(contactId) {
  const contact = addressBook.findContact(contactId);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".phone-number").html(contact.phoneNumber);
  Object.keys(contact.emailAddresses).forEach(key => {
    $("." + key + "-email-address").html(contact.emailAddresses[key]);

  })
  // $(".work-email-address").html(contact.emailAddresses["work"]);
  // $(".home-email-address").html(contact.emailAddresses["personal"]);
  let buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" +  + contact.id + ">Delete</button>");
}

$(document).ready(function() {
  attachContactListeners();
  $("form#new-contact").submit(function(event) {
    event.preventDefault();
    const inputtedFirstName = $("input#new-first-name").val();
    const inputtedLastName = $("input#new-last-name").val();
    const inputtedPhoneNumber = $("input#new-phone-number").val();
    const inputtedWorkEmailAddress = $("input#new-work-email").val();
    const inputtedHomeEmailAddress = $("input#new-home-email").val();
    

    $("input#new-first-name").val("");
    $("input#new-last-name").val("");
    $("input#new-phone-number").val("");
    $("input#new-work-email").val("");
    $("input#new-home-email").val("");

    let newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber, inputtedWorkEmailAddress, inputtedHomeEmailAddress);
    addressBook.addContact(newContact);
    displayContactDetails(addressBook);
  });
});