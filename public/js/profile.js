var editBtn = document.getElementById("editBtn")

editBtn.addEventListener("click", function(e) {
    e.preventDefault();

    $("#fname").prop("disabled", false);
    $("#lname").prop("disabled", false);
    $("#email").prop("disabled", false);
    $("#birthday").prop("disabled", false);
    $("#phone").prop("disabled", false);
    $("#gender").prop("disabled", false);
    $("#nation").prop("disabled", false);
    $("#bio").prop("disabled", false);

    document.getElementById("cfmBtn").style.display = "block";
    editBtn.style.display = "none";
});

