const key = 'ffc2c0eee045e3efaee8dbcbe56a9aaf'
const selectedCity = document.querySelector('.selected_city')
const cityElem = document.querySelector('.city_elem')
const cityTemp = document.querySelector('.temp')
const tempFeelsLike = document.querySelector('.feels_like')
const cityCloudy = document.querySelector('.cloudy')
const cityHumidity = document.querySelector('.humidity')
const cityPressure = document.querySelector('.pressure')
const cityWind = document.querySelector('.wind_speed')
const borderArray = document.querySelectorAll('.elem_border')
const infoAboutWeather = document.querySelector('.all_info_about_weather')
const searchButton = document.querySelector('.search_button')
const addButton = document.querySelector('.add_button')
const addedCities = document.querySelector('.added_cities')
const notFoundCity = document.querySelector('.not_found');
let currentCity = ''

const itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []
localStorage.setItem('items', JSON.stringify(itemsArray))
const data = JSON.parse(localStorage.getItem('items'))

selectedCity.onfocus = function() {
  notFoundCity.classList.remove('not_found_color')
}

async function getWeather(url) {
  const data = await fetch(url)
  if (data.ok) { 
    const result = await data.json()
    getData(result) 
    addButton.style.display = 'block'
    return result
  }
  selectedCity.blur()
  notFoundCity.classList.add('not_found_color')
}

function checkCityData() {
  const cityKey = selectedCity.value
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityKey}&appid=${key}&units=metric&lang=ru`
  getWeather(url)
  selectedCity.value = ''
}

selectedCity.onkeyup = (e) => {
  if (e.key === 'Enter' && selectedCity.value) {
    checkCityData()
  }
}

searchButton.onclick = checkCityData

function getData(result) {
  const temp = Math.round(result.main.temp)
  const tfeel = Math.round(result.main.feels_like)
  const pressure = Math.round(result.main.pressure / 1.333)
  const wind = Math.round(result.wind.speed)
  infoAboutWeather.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
  borderArray.forEach(elem => elem.style.borderBottom = '1px solid black')
  dataOutput(result, temp, tfeel, pressure, wind)
  currentCity = result
}

function dataOutput(result, temp, tfeel, pressure, wind) {
  cityElem.innerHTML = result.name

  cityTemp.children[0].innerHTML = 'Температура'
  cityTemp.children[1].innerHTML = `${temp}°`

  tempFeelsLike.children[0].innerHTML = 'Ощущается как'
  tempFeelsLike.children[1].innerHTML = `${tfeel}°`

  cityCloudy.children[0].innerHTML = 'Облачность'
  cityCloudy.children[1].innerHTML = `${result.clouds.all}%`

  cityHumidity.children[0].innerHTML = 'Влажность'
  cityHumidity.children[1].innerHTML = `${result.main.humidity}%`

  cityPressure.children[0].innerHTML = 'Давление'
  cityPressure.children[1].innerHTML = `${pressure} мм`

  cityWind.children[0].innerHTML = 'Ветер'
  cityWind.children[1].innerHTML = `${wind} м/с`
}

function createNewElems(param) {
  const div = document.createElement('div')
  const cityDiv = document.createElement('div')
  const deleteBut = document.createElement('i')
  cityDiv.classList.add('usedCity')
  cityDiv.innerHTML = param
  deleteBut.classList.add('fas', 'fa-times');
  addedCities.appendChild(div);
  div.appendChild(cityDiv)
  div.appendChild(deleteBut)
  deleteBut.onclick = () => {
    addedCities.removeChild(div)
    itemsArray.filter((elem, index) => {
      if (elem === cityDiv.innerHTML) {
        itemsArray.splice(index, 1)
        localStorage.setItem('items', JSON.stringify(itemsArray))
      }
    })
  }
  cityDiv.addEventListener('click', function() {
    let cityKey = cityDiv.textContent
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityKey}&appid=${key}&units=metric&lang=ru`
    getWeather(url)
  })
}

addButton.addEventListener('click', function addElement() {
  const usedCity = document.querySelectorAll('.usedCity')
  if (usedCity.length) {
    const checkingUsedValues = [...usedCity].find(el => {
      return el.innerHTML === currentCity.name
    })
    if (checkingUsedValues) return
  }
  const localChecked = data.find(el => el == currentCity.name)
  if (localChecked) return
  itemsArray.push(currentCity.name)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  createNewElems(currentCity.name)
})

const liMaker = text => createNewElems(text)

data.forEach(item => liMaker(item))