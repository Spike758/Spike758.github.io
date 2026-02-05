document.addEventListener("DOMContentLoaded", function() {
    animateElementOnScroll();
  });
  let burgerInfo = document.getElementById('burger-info');
let shadow = document.getElementById('shadowBack');
let btnBurger = document.getElementById('closeBurger');
const menu = () => {
    burgerInfo.classList.add('active');
    burgerInfo.classList.add('show');
    shadow.classList.add('active');
  }
  
  const closeMenu = () => {
    burgerInfo.classList.remove('active');
    shadow.classList.remove('active');
  }
function animateElementOnScroll() {
    let circle = document.querySelectorAll(".circle");
  
    function checkVisibility() {
     
      let windowHeight = window.innerHeight;
  
     
  
      circle.forEach(function(element) {
        let position = element.getBoundingClientRect();
  
       
        if (position.top < windowHeight && position.bottom >= 0) {
          setTimeout(function() {
            element.classList.add("circle-animation");
          }, 100); 
        }
      });
    }
  
   
    window.addEventListener("load", checkVisibility);
  

    window.addEventListener("scroll", checkVisibility);
  }
  const footerRequest = () => {
    let f1 = document.querySelector('.send_request input[type=text]');
    let f2 = document.querySelector('.send_request input[type=tel]');

    var params = {
      name: f1.value,
      email: f2.value,
    };
  
    const serviceID = "service_n3fvhtp";
    const templateID = "template_0xs5578";
    let modalWindow = document.getElementById('modal');
    let warningMessage = document.getElementById('warningMessage1');
    if (f2.value.length === 16 && f1.value.length > 1) {
    modalWindow.classList.add('active');
    emailjs.send(serviceID, templateID, params)
    .then(res=>{
        document.getElementById("nameMask").value = "";
        document.getElementById("modalTel").value = "";
        console.log(res);
    })
    modalWindow.innerHTML = `
        <input type="button" value="X" class="btn" id="modal-btn-close" onclick="modalClose()">
        <h4>Спасибо!</h4>
        <p>Ваша заявка отправлена!</p>
    `;
    let modalCloseButton = document.getElementById('modal-btn-close');
    modalCloseButton.style = 'bottom: 91%; left: 91%;';
    modalWindow.style = 'width: 200px; height: 130px; text-align:center;';

    shadow.classList.add('active'); 
    f2.value = ''
    f1.value = ''
    warningMessage.classList.remove('active')
    } 
    else {
      warningMessage.classList.add('active')
    }
}
function noDigits(event) {
    if ("1234567890".indexOf(event.key) != -1)
      event.preventDefault();
  }
  
const phoneInput = document.querySelector(".phoneMask")
const mask = new IMask(phoneInput, {
    mask: "+{7}(000)000-00-00"
  })
  const modalClose = () => {
    let modalWindow = document.getElementById('modal');
    let warningMessage = document.getElementById('warningMessage');
  
    modalWindow.classList.remove('active');
    shadow.classList.remove('active');
    warningMessage.style = 'display: none';
  };

  