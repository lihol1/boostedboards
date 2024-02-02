'use strict';

const preloader = document.querySelector('.loader');
const header = document.querySelector('.header');
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('.nav');
// const navLinks = document.querySelectorAll('.nav__link');
const avatar = document.querySelector('.header__icon');
const loginModal = document.querySelector('.login-modal');
const cartNum = document.querySelector('.header__icon-num');
const scrollElements = document.querySelectorAll('[data-scroll]');
const giftBtn = document.querySelector('.gift-card__button');
const giftCard = document.querySelector('.gift-card__body');
const giftCardFront = document.querySelector('.gift-card__front');
const giftCardBack = document.querySelector('.gift-card__back');
const upBtn = document.querySelector('.footer__up');
const cartIcons = document.getElementsByClassName('prods__cart-icon');
const items = document.getElementsByClassName('prods__item');
const prodsBtns = document.getElementsByClassName('prods__button');
const images = document.getElementsByClassName('prods__image');
const closeIcons = document.getElementsByClassName('close-icon__img');
const sliderWrapper= document.querySelector('.gallery__wrapper')
const slider = document.querySelector('.gallery__slider');
const controllers = document.querySelectorAll('.gallery__controller');
const iconCart = document.querySelector('.header__icon-cart');

let cart = JSON.parse(localStorage.getItem('chosenProds'))||[];
let sliderItems = document.getElementsByClassName('gallery__slide');

// Прелоудер
window.onload=()=>{
    if(preloader){
        setTimeout(function(){
            preloader.style.display='none';
            document.body.style.overflow = 'auto';
            document.body.style.height = '100%';
            }, 500);                  
        } 
    }


// Открытие-закрытие бургер-меню
burgerMenu.addEventListener('click', function(){
    nav.classList.toggle('nav--active');
    burgerMenu.classList.toggle('burger-menu--active');
})
if(window.innerWidth < 992){
    nav.addEventListener('click', (e)=>{
        if(e.target.textContent== 'Contacts'){
            nav.classList.remove('nav--active');
            burgerMenu.classList.remove('burger-menu--active');
        }
    }) 
}

function saveCart (){
    localStorage.setItem('chosenProds', JSON.stringify(cart));
}

function getcartNum (){
    if (cart.length > 0) {
       cartNum.classList.remove('hidden'); 
       cartNum.textContent=cart.length;
    } else {
        cartNum.classList.add('hidden'); 
    }
}
getcartNum ();

// открытие окна входа в аккаунт
avatar.addEventListener('click', function(e){
    loginModal.classList.remove('hidden');
    disableScroll (e.target);
    loginModal.querySelector('.login-modal__bg').onclick = e => {
        loginModal.addEventListener('click', function (){
                this.classList.add('hidden');
                enableScroll (e.target); 
            })
        loginModal.querySelector('.login-modal__form').addEventListener('click', e=>{
            e.stopPropagation();  
        })                  
        disableScroll (e.target);         
    }
})

// Открытие, закрытие модальных окон 
document.addEventListener('DOMContentLoaded', openModal);
document.addEventListener('DOMContentLoaded', closeModal);

function openModal () {
    Array.from(images).forEach(item =>{        
        item.onclick = e => {            
            let modal = item.parentElement.nextElementSibling;
            modal.classList.remove('hidden');
            modal.addEventListener('click', function (){
                this.classList.add('hidden');
                enableScroll (e.target); 
            })
            modal.querySelector('.prods__desc-block').addEventListener('click', e=>{
                e.stopPropagation();  
            })                  
            disableScroll (e.target);         
        }
    });    
}

// Закрытие элементов при нажатии на крестик
function closeModal (){
    Array.from(closeIcons).forEach(function(item){
        item.addEventListener('click', function(e){            
            item.closest('[data-modal="close"]').classList.add('hidden');
            enableScroll (e.target);
        })
    })
}

// Плавный скролл
let velocity = .3;
let topOffset = 96;
scrollElements.forEach(el =>{   
    el.addEventListener('click', function(e){
        e.preventDefault();
        let winYOffset = window.pageYOffset;
        let att= this.dataset.scroll;        
        //расстояние до элемента       
        let elemTop = document.querySelector("#" + `${att}`).getBoundingClientRect().top - topOffset;
        let start = null;
        requestAnimationFrame(step);
        
        function step(time) {
            if(start===null) {
                start = time;
            }
            let progress = time - start;
            let r = (elemTop < 0 ? Math.max(winYOffset - progress / velocity, winYOffset + elemTop) : Math.min(winYOffset + progress / velocity, winYOffset + elemTop));
            window.scrollTo(0,r);
            if(r !=winYOffset + elemTop) {
                requestAnimationFrame(step)
            } else return;
        }

    })
})

// Кнопка покупки подарочной карты
if(giftBtn) {
    giftBtn.addEventListener('click', ()=>{
        const giftCard={
            id: 'card',
            title: 'Gift card',
            price: 1000.00,
            salePrice: 1000.00,
            qty: 1,
            srcImg: './img/gift-card/mini-gift-card.jpg'
        }
        if (cart == []) {
            cart.push(giftCard);
        } else {
            let num=0;
            cart.forEach(el=>{
                if(el.id !== 'card') {
                    num++;
                }
            })
            if (cart.length == num){
                cart.push(giftCard);
            }  
        }
        saveCart ();
        getcartNum();
    })
}
// Переворачиваем карточку по клику на мобильных
if(giftCard) {
    if(window.matchMedia('(hover: none)').matches){
        giftCardFront.style.transform = 'rotateY(0deg)';
        giftCardBack.style.transform = 'rotateY(-180deg)';        
        giftCard.addEventListener('click', ()=>{            
            if(giftCardFront.style.transform == 'rotateY(0deg)') {
                giftCardFront.style.transform = 'rotateY(-180deg)';
                giftCardBack.style.transform = 'rotateY(0deg)';
            } else {
                giftCardFront.style.transform = 'rotateY(0deg)';
                giftCardBack.style.transform = 'rotateY(-180deg)';
            }
        })
    }
}
// сохраняем статус иконок
function getIconState (catalog){
    let str=catalog[0]['id'].replace(/[^a-z]/g, ''); 
    let iconState=[];
    Array.from(items).forEach(item=>{
        let newObj ={
            'id': item.getAttribute('id'),
            'state': item.querySelector('[data-state]').getAttribute('class')
        }
        iconState.push(newObj);          
                
    })
    localStorage.setItem(`${str}-iconState`, JSON.stringify(iconState));
}

// Добавление/удаление товара в корзину, смена значка

function setCartListener (catalog){
    Array.from(cartIcons).forEach(icon=>{ 
        icon.addEventListener('click', (e)=>{
            catalog.forEach(el=>{
                let id = e.target.closest('.prods__item').getAttribute('id');
                if (id === el.id){                    
                    if (icon.classList.contains('checked')){
                        icon.classList.remove('checked');
                        cart = cart.filter(el =>el.id!==id);
                        getcartNum ();
                    } else {
                        const prodImg = e.target.closest('.prods__item').querySelector('.prods__image');
                        const imageFly = prodImg.cloneNode(true);
                        const imageFlyWidth = prodImg.offsetWidth;
                        const imageFlyHeight = prodImg.offsetHeight;
                        const imageFlyTop = prodImg.getBoundingClientRect().top;
                        const imageFlyLeft = prodImg.getBoundingClientRect().left;

                        imageFly.setAttribute('class', 'flyImage prods__image');
                        imageFly.style.cssText = `
                        left: ${imageFlyLeft}px;
                        top: ${imageFlyTop}px;
                        width: ${imageFlyWidth}px;
                        height: ${imageFlyHeight}px;
                        `
                        document.body.append(imageFly);

                        const cartFlyLeft= iconCart.getBoundingClientRect().left;
                        const cartFlyTop= iconCart.getBoundingClientRect().top;
                        
                        imageFly.style.cssText = `
                        left: ${cartFlyLeft}px;
                        top: ${cartFlyTop}px;
                        width: 0;
                        height: 0;
                        opacity: 0;
                        `
                        cart.push(el);
                        icon.classList.add('checked'); 
                        
                        imageFly.addEventListener('transitionend', function(){
                            getcartNum ();
                            imageFly.remove();
                        })                        
                    }
                }
            })
            saveCart ();
            getIconState (catalog);  
        })
    })
}


// Анимируем части
function animateItems (){
    //вешаем на элемент класс _anim-items
    // Если хотим, чтобы анимировалось один раз при загрузке - класс _anim-no-hide
    // стилизуем средствами css
    // если текст, параграфы, класс _anim-items вешаем на статичный класс(родитель) 
    
    // Когда прокручиваем 1/4 часть объекта, добавляется класс _active
    
        const animItems = document.querySelectorAll('._anim-items');
    
        if (animItems.length>0) {
            window.addEventListener('scroll', animOnScroll);
            function animOnScroll(params) {
                for (let i = 0; i < animItems.length; i++) {
                    const animItem = animItems[i];
                    const animItemHeight = animItem.offsetHeight;
                    const animItemOffset = offset(animItem).top;
                    const animStart = 10;
    
                    let animItemPoint = window.innerHeight - animItemHeight / animStart;
                    
                    if (animItemHeight > window.innerHeight) {
                        animItemPoint = window.innerHeight - window.innerHeight / animStart;
                    }
    
                    if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {                                        
                        animItem.classList.add('_active');
                    } else {
                        if (!animItem.classList.contains('_anim-no-hide')) {
                           animItem.classList.remove('_active'); 
                        }                    
                    }
    
                }
            }
            function offset(el) {
                const rect = el.getBoundingClientRect(),
                    scrollLeft = window.scrollX|| document.documentElement.scrollLeft,//scrollY  равно pageYOffset (устарело, используется для поддержания IE)
                    scrollTop = window.scrollY || document.documentElement.scrollTop;
                return { top: rect.top + scrollTop, left: rect.left + scrollLeft}
            }
    
            // Если хотим, чтобы появлялось с задержкой изначально при загрузке страницы (на 1 стр)
            // setTimeout(()=>{
            //    animOnScroll();  
            // }, 300)
    
            animOnScroll();  
        }
    }
animateItems();

// Слайдер
window.addEventListener('load', initSliders);
function initSliders() {   
    if(document.querySelector('.swiper')) {
        new Swiper('.gallery__slider', {            
            // autoplay: {
            //     delay: 3000,
            //     disableOnInteraction: false,
            //     // pauseOnMouseEnter: true
            // },
            observer: true,
            observeParents: true,            
            spaceBetween: 50,
            
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    centeredSlides: true,
                    // slidesPerView: 1,
                    spaceBetween: 20, 
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 10,                      
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 10,                      
                },
              
            },
            // autoHeight: true,
            speed: 1000,
            slidesPerView: 'auto', //?
            loop: true, 

            // If we need pagination
            pagination: {
            el: '.gallery__pagination',
            clickable: true,
            // dynamicBullets: true 
            },
        
            // Navigation arrows
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            },
        
            // Наш код для слайдера
            // чтобы сделать счетчик слайдов 01/03
            on: {
                init: function (swiper) {                    
                },
                slideChange: function (swiper) {
                                     
                },
                
            }
            
        });
        
    }    
}

//  кнопка 'Buy now'
function setBtnListener(catalog){
  Array.from(prodsBtns).forEach(elem=>{
    elem.addEventListener('click', (e)=>{
        let id = e.target.closest('.prods__item').getAttribute('id');
        let icon = e.target.parentElement.nextElementSibling;
        if (!icon.classList.contains('checked')){
            icon.classList.add('checked');
            catalog.forEach(el=>{               
                if(el.id===id) {
                    cart.push(el);
                } 
            })
        }            
    saveCart ();
    getcartNum ();
    getIconState (catalog);
    })    
  })  
}

// Устанавливаем сохраненные состояния иконок корзины
function setIconState (){
    Array.from(items).forEach(item=>{
        for(let i=0; i<Array.from(items).length; i++){
            if (item.getAttribute('id')===savedIconState[i]['id'])    {                       
                item.querySelector('[data-state]').className = savedIconState[i]['state'];
            }
        } 
                        
    })     
}

// Кнопка вверх
if(upBtn){
    upBtn.onclick=()=>{
        scrollTo(0,0);
    }
}
window.onscroll = ()=>{
    if (window.scrollY > 1950) {
        upBtn.classList.remove('hidden');    
    } else {
        upBtn.classList.add('hidden');
    }
}  

// Скролл
function disableScroll (targetEl){
    
    const bodyEl = targetEl.closest('body');
    const scrollPosition = window.scrollY;
    const windowW = window.innerWidth;
    const pageW = bodyEl.offsetWidth;  
    bodyEl.classList.add('fixed');  
      
    bodyEl.dataset.position = scrollPosition;
    bodyEl.style.top = -scrollPosition + 'px';
    bodyEl.style.paddingRight = windowW - pageW + 'px'; 
    header.style.paddingRight = windowW - pageW + 'px'; 
}

function enableScroll (targetEl){ 
    const bodyEl = targetEl.closest('body');
    const scrollPosition = parseInt(bodyEl.dataset.position);  
    bodyEl.classList.remove('fixed');
    bodyEl.style.top = 'auto';
    window.scroll({top: scrollPosition, left: 0});
    bodyEl.style.paddingRight = 0; 
    header.style.paddingRight = 0;
}





