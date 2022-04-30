// Focus div based on nav button click

const handlesingleflip = async () => {
    const res = await fetch("/app/flip/", {
        method: 'GET', 
        headers: {
            'Content-Type': 'text/json'
        }
    }); 
    const data = await res.json();
    document.getElementById('single-result').innerHTML = data.flip;
    if (data.flip == 'heads') {
        document.getElementById('single-result-img').src = "./assets/img/heads.png";  
    }  
    else {
        document.getElementById('single-result-img').src = "./assets/img/tails.png";  
    }
    
}

const handlemultipleflips = async () => {
    const count = document.getElementById('multiple-flip-input').value
    console.log(count)
    const res = await fetch("/app/flip/coins/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({number: count})
    }); 
    const data = await res.json(); 
    const heads = document.getElementById('heads');
    const tails = document.getElementById('tails');
    heads.style = `--size: calc( ${data.summary.heads / data.raw.length})`
    tails.style = `--size: calc( ${data.summary.tails / data.raw.length})`
}


const handleclick = (id) => {
    const page = document.getElementsByClassName(id)[0]; 
    if (!page.className.includes('show')) {
        const current = document.getElementsByClassName("show")[0];
        current.classList.remove("show");
        document.getElementById(id).classList.add('highlight');
        document.getElementById(current.className).classList.remove('highlight');
        current.classList.add("hidden");
        page.classList.add("show");
        page.classList.remove("hidden"); 
    }
}


const addListenersToNavigation = () => {
    const buttons = document.getElementsByClassName('nav');
    Array.from(buttons).forEach(element => {
        element.addEventListener("click", () => handleclick(element.id)); 
    })
    // buttons.array.forEach(button => {
    //     button.addEventListener("click", () => handleClick(button.id))
    // });
}

window.onload = () => {
    addListenersToNavigation(); 
}

// Flip one coin and show coin image to match result when button clicked

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
