const salidas =document.querySelectorAll('.salidas')
const ingreso =document.querySelectorAll(".ingreso")

console.log(salidas,ingreso);

export const logcheck = (user) => {
    if (user) {
        salidas.forEach(link => link.style.display = "none");
        ingreso.forEach(link => link.style.display = "block");
    } else {
        salidas.forEach(link => link.style.display = "block");
        ingreso.forEach(link => link.style.display = "none");
        
    }
}       

   