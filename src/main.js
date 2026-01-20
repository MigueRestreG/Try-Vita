import './style.css'

const routes = {
  "home": "/views/home.html",
  "login": "/views/login.html",
  "about": "/views/about.html"
}

document.body.addEventListener('click', (e)=>{
  // console.log(e);
  if (e.target.matches("[data-link]")){
    e.preventDefault()
    const route = e.target.getAttribute("href").replace("./", "")

    navigate(route)
  }
})



const navigate = async (pathname) => {
  const route = routes[pathname]

  const html = await fetch(route).then((resp)=>resp.text())
  console.log(html);

  document.querySelector('#app').innerHTML = html
}

