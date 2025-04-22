const countryInputForm = document.getElementById('countryForm')
const allPath = document.querySelectorAll(".allPath")
const svg = document.querySelector(".svg");

countryInputForm.addEventListener("submit", (e) => {
    e.preventDefault()
    findCountry(e)
    e.target.userInput.value = ""
    
})


function findCountry(e){
    allPath.forEach(path => {
        const countryName = path.getAttribute("name")
        if(e.target.userInput.value.toLowerCase() === countryName.toLowerCase()){
            const bbox = path.getBBox();
            const x = bbox.x + bbox.width / 2;
            const y = bbox.y + bbox.height / 2;
            path.style.fill = "#fad2e1"
            const text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.setAttribute("x", x)
            text.setAttribute("y", y)
            text.setAttribute("font-size", "10")
            text.setAttribute("fill", "red")
            text.setAttribute("pointer-events", "none")
            text.textContent = e.target.userInput.value;
            svg.appendChild(text);
        }
    })
}




