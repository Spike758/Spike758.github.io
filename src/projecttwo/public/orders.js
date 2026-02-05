




const openEdit = (element) => {
    let editBlock = element.parentNode;
    let editList = element.parentNode.parentNode.querySelector('.list')
    let editListH3 = element.parentNode.parentNode.querySelector('.list .block h3')
    let colAction = element.parentNode.parentNode.parentNode.querySelector('.block-edit h3').innerHTML
    editListH3.innerHTML = colAction
    editBlock.setAttribute('style', 'display: none')  
    editList.setAttribute('style', 'display: flex;')

}
let blockP;
const openList = (element) => {
    blockP = element.parentNode.querySelector('.p-block');
    let blockPStyle = window.getComputedStyle(blockP);

    if (blockPStyle.display === 'none') {
        blockP.style.display = 'flex';
    } else {
        blockP.style.display = 'none';
    }

        
}

const changeText = (element) => {
    let currentP = element.innerHTML;
    let colAction = element.parentNode.parentNode.parentNode.parentNode.querySelector('.block-edit h3')
    console.log(colAction)
    if (currentP == 'Новый' ) {
        colAction.innerHTML = 'Новый'
    } if (currentP == 'В процессе') {
        colAction.innerHTML = 'В процессе'
    } if (currentP == 'Завершен') {
        colAction.innerHTML = 'Завершен'
    }
    let editBlock = element.parentNode.parentNode.parentNode.querySelector('.block-edit');
    console.log(editBlock)
    let editList = element.parentNode.parentNode;
    blockP.style.display = 'none'
    editBlock.setAttribute('style', 'display: flex')  
    editList.setAttribute('style', 'display: none;')
}
// const openPanel = () => {
//     let panel = document.querySelector('.panel')
//     if(panel.classList.contains('active')) {
//       panel.classList.remove('active')
//     } else {
//       panel.classList.add('active')
//     }
//   }