'use strict';

const preloader = document.querySelector('.loader');
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('.nav');
const avatar = document.querySelector('.header__icon');
const loginModal = document.querySelector('.login-modal');
const cartNum = document.querySelector('.header__icon-num');
const scrollElements = document.querySelectorAll('[data-scroll]');
const giftBtn = document.querySelector('.gift-card__button');
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
window.onload = function (){
    setTimeout(function(){
        preloader.classList.add('loader_hidden');
        document.body.style.overflow = 'auto';
        document.body.style.height = 'unset';
    }, 500);
}


// Открытие-закрытие бургер-меню
burgerMenu.addEventListener('click', function(){
    nav.classList.toggle('nav--active');
    burgerMenu.classList.toggle('burger-menu--active');
})

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


// Слайдер
if(slider) {
    sliderInit();    
}     
function sliderInit(){
    let index=2;
    let size;
    let slides = Array.from(sliderItems);
   
    copy();
    getParams();   
    window.addEventListener('resize', function (){
        getParams();
    }); 
    slider.style.transform = 'translateX('+(-index*size)+ 'px)'; 
    controllers.forEach(function(el){
        el.addEventListener('click', move);
    })

    function copy(){
        let cloneFirst = slides[0].cloneNode(true);
        let cloneSecond = slides[1].cloneNode(true);
        let cloneLastButOne = slides[slides.length-2].cloneNode(true);    
        let cloneLast = slides[slides.length-1].cloneNode(true);    
        cloneFirst.setAttribute('data-num', 'firstClone');
        cloneSecond.setAttribute('data-num', 'secondClone');
        cloneLast.setAttribute('data-num', 'lastClone');
        cloneLastButOne.setAttribute('data-num', 'lastButOneClone');
        slider.appendChild(cloneFirst);
        slider.appendChild(cloneSecond);
        slider.insertBefore(cloneLast, slider.firstElementChild);
        slider.insertBefore(cloneLastButOne, slider.firstElementChild);
        slides = Array.from(document.getElementsByClassName('gallery__slide'));        
    } 

    function getParams(){
        if(window.innerWidth < 992) {
            size = sliderWrapper.clientWidth;            
        } else {  
            size = sliderWrapper.clientWidth/3;  
        }
        slides.forEach(item =>{       
                item.style.maxWidth = '480px';
                item.style.width = size + 'px';
                item.style.height = 'auto';
            })  
        slider.style.transform = 'translateX('+(-index*size)+ 'px)';
    }
   
    function jump (){
        slider.addEventListener('transitionend', function () {           
            slides[index+2].dataset.num === 'secondClone' ? index = 1 : index; 
            slides[index].dataset.num === 'lastButOneClone' ? index = 5 : index; 
            slider.style.transition = 'none';                 
            slider.style.transform = 'translateX('+(-index*size)+ 'px)';
        })        
    }

    function move(e){
        controllers.forEach(function(el){
            el.removeEventListener('click', move);
        })        
        slider.style.transition = 'all 0.6s ease-in-out';        
        if (e.target.classList.contains('gallery__controller--next')){ 
            index >= 7 ? false: index++;
        } else if (e.target.classList.contains('gallery__controller--prev')){            
            index <= 0 ? false : index--;
        }
        slider.style.transform = 'translateX('+(-index*size)+ 'px)';          
        jump();
        setTimeout(function (){
            controllers.forEach(function(el){
                el.addEventListener('click', move);
            })
        }, 600) 
    }  
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
                        console.log(animItemHeight)
                        console.log(window.innerHeight)
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
// animateItems();

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
window.onscroll = ()=>{
    if (window.pageYOffset > 1950) {
        upBtn.classList.remove('hidden');    
    } else {
        upBtn.classList.add('hidden');
    }
}  

// Скролл
function disableScroll (targetEl){
    let bodyEl = targetEl.closest('body');
    let scrollPosition = window.scrollY;
    let windowW = window.innerWidth;
    let pageW = bodyEl.offsetWidth;  
    bodyEl.classList.add('fixed');        
    bodyEl.dataset.position = scrollPosition;
    bodyEl.style.top = -scrollPosition + 'px';
    bodyEl.style.paddingRight = windowW - pageW + 'px';     
}

function enableScroll (targetEl){ 
    let bodyEl = targetEl.closest('body');
    let scrollPosition = parseInt(bodyEl.dataset.position);  
    bodyEl.classList.remove('fixed');
    bodyEl.style.top = 'auto';
    window.scroll({top: scrollPosition, left: 0});
    bodyEl.style.paddingRight = 0;
}





