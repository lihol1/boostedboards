'use strict';

const cartBlock = document.querySelector('.cart__block');
const cartEmpty = document.querySelector('.cart__empty');
const cartItems = document.querySelector('.cart__items-row');
const totalRow = document.querySelector('.cart__total-row');
const btnsQty = document.getElementsByClassName('cart__button');
const crossIcons = document.getElementsByClassName('cart__remove');
const cartSums = document.getElementsByClassName('cart__sum');
const cartInputs = document.getElementsByClassName('cart__num');

if (cart.length>0) {
    cartBlock.classList.remove('hidden');
    cartEmpty.classList.add('hidden');
};

function renderCart(){
    cartItems.innerHTML='';
    totalRow.innerHTML='';
    
    cart.forEach( prod => {
        let price = prod.salePrice || prod.price;
        let cartItemHtml=`
                        <div class="cart__item" id="${prod.id}">
                            <div class="cart__image">
                                <img src="${prod.srcImg}" alt="${prod.title}">                            
                            </div>
                            <div class="cart__desc">${prod.title}</div>
                            <div class="cart__quantity">
                                <form class="cart__form-quantity">
                                    <input class="cart__num" type="number" min ="1" value="${prod.qty}">
                                </form>
                                <div class="cart__btns">
                                    <button type="button" class="cart__button plus" data-sign="plus">
                                        <img src="./img/icons/icon-up.svg" alt="Arrow up">
                                    </button>
                                    <button type="button" class="cart__button minus" data-sign="minus">
                                        <img src="./img/icons/icon-down.svg" alt="Arrow down">
                                    </button>
                                </div>
                            </div>
                            <div class="cart__sum-block">
                                <div>US $<span class="cart__sum">${(prod.qty*price).toFixed(2)}</span></div>
                            </div>
                            <div class="cart__remove">
                                <img src="./img/icons/x.svg" alt="Remove icon">
                            </div>
                        </div>
        `
        cartItems.innerHTML+=cartItemHtml;
        setBtnListener();                
    })
    
    let totalHtml =` 
            <div class="cart__total-text">Subtotal</div>
            <div class="cart__total-sum">US $${getTotal()}</div>
        `
    totalRow.innerHTML+= totalHtml;    
}
renderCart();

function setBtnListener () {
    Array.from(btnsQty).forEach(elem =>{
        elem.addEventListener('click', () => {        
            if (elem.classList.contains('plus')) {
                addProd(elem.closest('.cart__item').id)
            } else {
                reduceProd(elem.closest('.cart__item').id)
            }
        })
    })
    Array.from(crossIcons).forEach(elem=>{
        elem.addEventListener('click', ()=>{
            removeProd(elem.closest('.cart__item').id)
        })
    })
    Array.from(cartInputs).forEach(elem =>{
        elem.addEventListener('blur', (e)=>{
            getSum((elem.closest('.cart__item').id), e)
        })
        elem.addEventListener('keydown', (e)=>{
            e.preventDefault();
            if (e.key==='Enter'){
                getSum((elem.closest('.cart__item').id), e)
            }
        })
    })
}


function getSum(id, e){
    cart.forEach(elem=>{        
        if(elem.id===id){
            elem.qty= e.target.value;
        }
    }) 
    saveCart ();    
    renderCart();
}

function addProd(id){
    cart.forEach(elem=>{        
        if(elem.id===id){
            elem.qty++;            
        }
    })     
    renderCart();
}

function reduceProd(id){
    cart.forEach(elem=>{        
        if(elem.id===id){
            if(elem.qty>1) {
                elem.qty--;
            }
        }
    })     
    renderCart();
}

function removeProd(id){
    let str=id.replace(/[^a-z]/g, '');
    cart.forEach(elem=>{
            if (elem.id===id) {
                cart=cart.filter(elem=>elem.id!==id);
                saveCart ();
            }
        })
    let iconsState = JSON.parse(localStorage.getItem(`${str}-iconState`));
    if(iconsState) {
        iconsState.forEach((el)=>{
            if(el.id===id) {
                el.state = 'prods__cart-icon';            
                localStorage.setItem(`${str}-iconState`, JSON.stringify(iconsState))
            }
        })
    }
    getcartNum ();    
    if (cart.length==0) {
        cartBlock.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
    }   
    renderCart();
}

function getTotal(){
    let total=0;
    Array.from(cartSums).forEach(elem=>{
        total+= parseFloat(elem.textContent);
    })
    return total.toFixed(2);
}









