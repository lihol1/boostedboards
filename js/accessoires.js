'use strict';

const accBlock = document.querySelector('.accessories__block');
let accItemHtml='';
let savedIconState=null;
savedIconState = JSON.parse(localStorage.getItem('acc-iconState'));

function render (){
    accessories.forEach(({id, title, price, salePrice, srcImg, srcModal, srcImgWebp, srcImgWebp2x}) => {
        let fixedPrice = price.toFixed(2); 
        let fixedSalePrice = salePrice.toFixed(2); 
        accBlock.innerHTML='';
        accItemHtml += `
            <div class="accessories__item prods__item" id="${id}">                 
                <img class="accessories__image prods__image" src="${srcImg}" alt="${title}" width="170" height="170">                                                
                <div class="accessories__info prods__info">
                    <div class="accessories__info-name" prods__info-name>${title}</div> 
                    <div class="accessories__info-price accessories__info-price--lthrough prods__info-price">$${fixedPrice}</div>
                    <div class="accessories__info-price prods__info-price accessories__info-price--red">$${fixedSalePrice}</div> 
                </div>
                <div class="accessories__btn-block prods__btn-block">
                    <a href="cart.html"><button class="accessories__button prods__button btn">Buy now</button></a>
                    <div class="prods__cart-icon" data-state>                        
                        <img src="img/icons/cart.svg" alt="Cart">                              
                    </div>
                </div>
            </div>
            <div class="accessories__modal prods__modal hidden" data-modal="close">
                <div class="accessories__modal-bg"></div>
                <div class="accessories__image-block prods__desc-block">
                    <div class="accessories__close-icon close-icon">                     
                        <img class="close-icon__img" src="img/icons/x.svg" alt="Close icon">
                    </div>
                    <picture class="accessories__image prods__image">
                        <source type="image/webp" srcset="${srcImgWebp} 1x, ${srcImgWebp2x} 2x">
                        <img src="${srcModal}" alt="${title}">
                    </picture>
                     
                </div>                        
            </div>            
        `           
        accBlock.innerHTML += accItemHtml;
        if(savedIconState!==null) {
            setIconState ();
        }
        setBtnListener (accessories);
        setCartListener (accessories);
    }); 
}
render ();
getcartNum ();












