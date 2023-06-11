
document.addEventListener('click', (e)=>{
  // change mode 
  if(e.target.classList.contains('change-theme')){
    document.body.classList.toggle('light-theme')
  }
})