//Navbar toggle button
function toggler(x) {
    x.classList.toggle("change");
    var sidenav = document.getElementById("mySidenav");
    var opacity = document.getElementById("opacity");
    sidenav.classList.toggle("open");
    opacity.classList.toggle("opa");
    document.body.classList.toggle("opa");
}
//Profile button
function profile() {
    const isLogged = localStorage.getItem("isLogged");

    // Si NO está logueado → ir al login
    if (isLogged !== "true") {
        window.location.href = "./login.html";
        return;
    }

    // Si SÍ está logueado → abrir menú como antes
    var profileMenu = document.getElementById("profileMenu");
    profileMenu.classList.toggle("active");

    var svg = document.querySelector(".profile-title svg");
    svg.classList.toggle("transform");
}
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isLogged") === "true") {
        const data = JSON.parse(localStorage.getItem("spotifyUser"));
        document.querySelector(".profile-title span").innerText = data.user;
    }
});