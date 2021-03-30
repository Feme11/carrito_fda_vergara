/* GUARDO ID'S => tranformo id's de html en const de js */
const selectionMovies = document.getElementById('selection-movies');
const items = document.getElementById('items');
const total = document.getElementById('total');

/* MIS TEMPLATES => tranformo template´s creados en html en const de js */
const movieCard = document.getElementById('movie-card').content
const shoppingCartTotal = document.getElementById('shoppingCart-total').content
const shoppingCartTable = document.getElementById('shoppingCart-table').content

/* FRAGMENT => nos permite guardar una estructura antes de mostrarla en el html, evitamos reflow */
const fragment = document.createDocumentFragment()

/*SHOPPING-CART VACIO */
let shoppingCart = {}  


/* EVENTOS */
document.addEventListener('DOMContentLoaded', () => {
    getMovies()
    /* CREAR INSTANCIA PARA GUARDAR COLECCIÓN DE OBJETOS EN LOCALSTORAGE */
    if(localStorage.getItem('shoppingCart')) {
        shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'))
        llenarShoppingCart()
    }
})

selectionMovies.addEventListener('click', e => {
    AddToShoppingCart(e)
})

items.addEventListener('click', e => {
    accionarButton(e)
})

let inputTitle
if(inputTitle == undefined){
    inputTitle = "movie";
}

const getMovies = async() => {
    
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${inputTitle}&page=2&apikey=bfb19173`);
        const data = await res.json();
        const newData = data.Search
        llenarCards(newData)
    }
    catch (error) {
        console.log(error)
    }  
}

const llenarCards = newData => {
    newData.forEach(movie => {
        movieCard.querySelector('h5').textContent = movie.Title;
        movieCard.querySelector('p').textContent = (movie.Year);
        movieCard.querySelector('img').setAttribute("src", movie.Poster);
        movieCard.querySelector('img').setAttribute("alt", movie.Title);
        movieCard.querySelector('button').dataset.id = movie.imdbID;

        const clone = movieCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    selectionMovies.appendChild(fragment);
}

const AddToShoppingCart = e => {
    if (e.target.classList.contains('button-add')) {
        setShoppingCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setShoppingCart = object => {
    const movie = {
        id: object.querySelector('.button-add').dataset.id,
        title: object.querySelector('h5').textContent,
        price: parseInt(object.querySelector('p').textContent),
        quantity: 1,
    }

    if (shoppingCart.hasOwnProperty(movie.id)) {
        movie.quantity = shoppingCart[movie.id].quantity + 1
    }

    shoppingCart[movie.id] = {...movie}
    llenarShoppingCart()
}

const llenarShoppingCart = () => {
    items.innerHTML = '';
    Object.values(shoppingCart).forEach(movie =>{
        shoppingCartTable.querySelector('th').textContent = movie.id
         shoppingCartTable.querySelectorAll('td')[0].textContent = movie.title
        shoppingCartTable.querySelectorAll('td')[1].textContent = movie.quantity
        shoppingCartTable.querySelector('.button-aumentar').dataset.id = movie.id
        shoppingCartTable.querySelector('.button-disminuir').dataset.id = movie.id
        shoppingCartTable.querySelector('span').textContent = movie.quantity * (movie.price)

        const clone = shoppingCartTable.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    llenarTotal()

    /* GUARDAR COLECCIÓN DE OBJETOS DEL SHOPPINGCART EN LOCALSTORAGE */
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart))
}

const llenarTotal = () => {
    total.innerHTML = '';

    if(Object.keys(shoppingCart).length === 0) {
        total.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        document.querySelector('#badge-value').innerHTML = 0
        return
    }

    const nQuantify = Object.values(shoppingCart).reduce((acc, {quantity}) => acc + quantity , 0)

    const nPrice = Object.values(shoppingCart).reduce((acc, {quantity, price}) => acc + quantity * price , 0)

    shoppingCartTotal.querySelectorAll('td')[0].textContent = nQuantify;
    shoppingCartTotal.querySelector('span').textContent = nPrice;
    document.querySelector('#badge-value').innerHTML = nQuantify  //cambia valor de badge

    const clone = shoppingCartTotal.cloneNode(true)
    fragment.appendChild(clone)
    total.appendChild(fragment)

    const vaciarShoppingCart = document.getElementById('vaciar-shoppingCart')
    vaciarShoppingCart.addEventListener('click', () => {
        shoppingCart = {}
        llenarShoppingCart()
    })
}

const accionarButton = e => {
    //AUMENTAR CANTIDAD DE PELÍCULAS
    if(e.target.classList.contains('button-aumentar')) {
        const movie = shoppingCart[e.target.dataset.id]
        movie.quantity++
        shoppingCart[e.target.dataset.id] = {...movie}
        llenarShoppingCart()
    }

    if(e.target.classList.contains('button-disminuir')) {
        const movie = shoppingCart[e.target.dataset.id]
        movie.quantity = shoppingCart[e.target.dataset.id].quantity - 1
        if(movie.quantity === 0){
            delete shoppingCart[e.target.dataset.id]
        }
        llenarShoppingCart()
    }

    e.stopPropagation()
}

