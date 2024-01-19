'use strict';

const  bBlock = document.querySelector('.boards__block');
let bItemHtml='';
let savedIconState=null;
savedIconState = JSON.parse(localStorage.getItem('b-iconState'));
   
function render (){
    boards.forEach(({id, title, price, srcImg, srcModal, srcImgBig, topSpeed, mileRange, deck, desc}) => {
        let fixedPrice = price.toFixed(2); 
        bBlock.innerHTML='';
        bItemHtml += `
            <div class="prods__item" id="${id}"> 
                <img class="boards__image prods__image" src="${srcImg}" alt="${title}" width="270" height="270">                                                
                <div class="boards__info prods__info">
                    <div class="prods__info-name">${title}</div> 
                    <div class="prods__info-price">$${fixedPrice}</div>                    
                </div>
                <div class="boards__btn-block prods__btn-block">
                    <a href="cart.html"><button class="prods__button btn">Buy now</button></a>
                    <div class="prods__cart-icon" data-state>                        
                        <img src="img/icons/cart.svg" alt="Cart">                              
                    </div>
                </div>
            </div> 
            <div class="boards__modal prods__modal hidden" data-modal="close">
                <div class="boards__modal-bg prods__modal-bg"></div>
                <div class="boards__desc-block prods__desc-block">
                    <div class="boards__close-icon close-icon"> 
                        <img class="boards__close__img close-icon__img" src="img/icons/x.svg" alt="Close icon">
                    </div>
                    <div class="boards__desc">
                        <picture class="boards__desc-img">
                            <source type="image/jpg" srcset="${srcImg}" media="(max-width:700px)">
                            <source type="image/webp" srcset="${srcModal}" media="(min-width:700px)">
                            <img src="${srcImg}" srcset="${srcImgBig} 2x" alt="${title}">
                        </picture>             
                        <div class="boards__text">
                            <h3>${title}</h3>
                            <p>${topSpeed}</p> 
                            <p>${mileRange}</p>                                       
                            <p>${deck}</p>
                            <p>${desc}</p>                            
                        </div>
                    </div>              
                </div>
            </div>                  
        `           
        bBlock.innerHTML += bItemHtml;
        if(savedIconState!==null) {
            setIconState ();
        }
        setBtnListener (boards);
        setCartListener (boards); 
             
    }); 
}

render ();
getcartNum ();

