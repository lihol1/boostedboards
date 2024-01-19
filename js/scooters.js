'use strict';

const  scBlock = document.querySelector('.scooters__block');
let savedIconState=null;
savedIconState = JSON.parse(localStorage.getItem('sc-iconState'));

let scItemHtml='';

function render (){
    scooters.forEach(({id, title, price, srcImg, srcImgBig, srcModal, controller, battery, maxMileage, maxSpeed, brakes, weight, material}) => {
        let fixedPrice = price.toFixed(2); 
        scBlock.innerHTML='';
        scItemHtml += `
            <div class="prods__item" id="${id}"> 
                <img class="scooters__image prods__image" src="${srcImg}" alt="${title}" width="270" height="270">                                                
                <div class="scooters__info prods__info">
                    <div class="prods__info-name" >${title}</div> 
                    <div class="prods__info-price">$${fixedPrice}</div>                    
                </div>
                <div class="scooters__btn-block prods__btn-block">
                    <a href="cart.html"><button class="prods__button btn">Buy now</button></a>
                    <div class="prods__cart-icon" data-state>                        
                        <img src="img/icons/cart.svg" alt="Cart">                              
                    </div>
                </div>
            </div> 
            <div class="scooters__modal prods__modal hidden" data-modal="close">
                <div class="scooters__modal-bg prods__modal-bg"></div>
                <div class="scooters__desc-block prods__desc-block">
                    <div class="scooters__close-icon close-icon"> 
                        <img class="scooters__close__img close-icon__img" src="img/icons/x.svg" alt="Close icon">
                    </div>
                    <div class="scooters__desc">
                        <picture class="scooters__desc-img">
                            <source type="image/jpeg" srcset="${srcImgBig}" media="(max-width:700px)">
                            <source type="image/webp" srcset="${srcModal}" media="(min-width:700px)">
                            <img src="${srcImg}" alt="${title}">
                        </picture>             
                        <div class="scooters__text">
                            <h3>${title}</h3>
                            <p>Controller: ${controller}</p> 
                            <p>Battery: ${battery}</p>
                            <p>Max mileage: ${maxMileage}</p>                                       
                            <p>Max Speed: ${maxSpeed}</p>
                            <p>Braking System: ${brakes}</p>
                            <p>Scooter Weight: ${weight}</p>
                            <p>Product Material: ${material}</p>                          
                        </div>
                    </div>              
                </div>
            </div>                  
        `           
        scBlock.innerHTML += scItemHtml;
        if(savedIconState!==null) {
            setIconState ();
        }
        setBtnListener (scooters);
        setCartListener (scooters);       
    }); 
}
render ();
getcartNum ();


