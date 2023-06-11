// set mode as user chosen
if(window.localStorage.mode && window.localStorage.mode=='light'){
  document.body.classList.add('light-theme')
}else{
  document.body.classList.remove('light-theme')
}


document.addEventListener('click', (e)=>{
  // change mode 
  if(e.target.classList.contains('change-theme')){
    document.body.classList.toggle('light-theme')

    if(document.body.classList.contains('light-theme')){
      window.localStorage.mode = 'light'
    }else{
      window.localStorage.mode = 'dark'
    }

  }
  



})