const dom = {
  selectbox: document.getElementById('selectbox'),
  selectboxList: document.querySelector('.selectbox__list'),
  rooms: document.getElementById('rooms'),
  settings: document.getElementById('settings'),
  settingsTabs: document.getElementById('settings-tabs'),
  settingsPanels: document.getElementById('settings-panel'),
  temperatureLine: document.getElementById('temperature-line'),
  temperatureRound: document.getElementById('temperature-round'),
  temperature: document.getElementById('temperature'),
  temperatureBtn: document.getElementById('temperature-btn'),
  temperatureSaveBtn: document.getElementById('save-temperature'),
  temperaturePowerBtn: document.getElementById('power'),
  sliders: {
    lights: document.getElementById('lights-slider'),
    humidity: document.getElementById('humidity-slider'),
  }

  

}
dom.selectbox.querySelector('.selectbox__selected').onclick = (event) => {
  dom.selectbox.classList.toggle('open')
}
const rooms = {
  all: 'Все комнаты',
  livingroom: 'Зал',
  bedroom : 'Спальня',
  kitchen: 'Кухня',
  bathroom: 'Ванная',
  studio: 'Кабинет',
  washingroom: 'Уборная',
}
let activeRoom = 'all';
let activeTab = 'temperature';
const roomsData = {
livingroom: {
  temperatureOff: false,
  temperature: 16,
  lights: 0,
  humidity: 0,
  humidityOff: false,
},
bedroom : {
  temperatureOff: false,
  temperature: 16,
  lights: 0,
  humidity: 0,
  humidityOff: false,
},
kitchen: {
  temperatureOff: false,
  temperature: 16,
  lights: 0,
  humidity: 0,
  humidityOff: false,
},
bathroom: {
  temperatureOff: false,
  temperature: 16,
  lights: 0,
  humidity: 0,
  humidityOff: false,
},
studio: {
  temperatureOff: false,
  temperature: 16,
  lights: 0,
  humidity: 0,
  humidityOff: false,
},
washingroom: {
  temperatureOff: false,
  temperature: 16,
  lights: 0,
  humidity: 0,
  humidityOff: false,
}
}

document.body.onclick = (event) => {
  const { target } = event
  if (
    !target.matches('.selectbox')
    && !target.parentElement.matches('.selectbox')
    && !target.parentElement.parentElement.matches('.selectbox')
  ){
      dom.selectbox.classList.remove('open');
  }
} 
dom.selectboxList.onclick = (event) => {
  const {target} = event
  if (target.matches('.selectbox__item')){
    const { room } = target.dataset
    const selectedItem = dom.selectboxList.querySelector('.selected')
    selectedItem.classList.remove('selected')
    target.classList.add('selected')
    dom.selectbox.classList.remove('open')
    selectRoom(room)
  }
}



function selectRoom(room) {
const selectedRoom = dom.rooms.querySelector('.selected');
const selectedSelectboxRoom = dom.selectbox.querySelector('.selectbox__item.selected');
if (selectedRoom) {
  selectedRoom.classList.remove('selected');
  selectedSelectboxRoom.classList.remove('selected')
}
if (room != 'all') {
  const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`);
  const {
    temperature,
    lights,
    humidity

   } = roomsData[room];
  newSelectedRoom.classList.add('selected');
  renderScreen(false)
  activeRoom = room;
  dom.temperature.innerText = temperature;
  renderTemperature();
  setTemperaturePower();
  changeSettingsType(activeTab);
  changeSlider(lights,dataSettingsdom.sliders.lights);
  changeSlider(humidity,dataSettingsdom.sliders.humidity);
} else {
  renderScreen(true)

}
  selectedSelectboxRoom.classList.remove('selected');
  const newSelectedItem = dom.selectbox.querySelector(`[data-room=${room}]`);
  newSelectedItem.classList.add('selected');
  const selectboxSelected = dom.selectbox.querySelector('.selectbox__selected span')
  selectboxSelected.innerText = rooms[room]


}

dom.rooms.querySelectorAll('.room').forEach(room => {
  room.onclick = (event) => {
  const value = room.dataset.room
  selectRoom(value)
  }
})

function renderScreen(isRooms){
  setTimeout(() => {
  if (isRooms){
      dom.rooms.style.display = 'grid'
      dom.settings.style.display = 'none'
  } else {
      dom.settings.style.display = 'block'
      dom.rooms.style.display = 'none'
  }
  }, 300)
}


/*ПАНЕЛЬ НАСТРОЕК КОМНАТЫ*/



function renderTemperature(temperature) {
const min = 16;
const max = 40;
const range = max - min;
const percent = range / 100;
const lineMin = 54;
const lineMax = 276;
const lineRange = lineMax - lineMin;
const linePercent = lineRange / 100;
const roundMin = -240;
const roundMax = 48;
const roundRange = roundMax - roundMin;
const roundPercent = roundRange / 100;


if (temperature >= min && temperature <= max) {
  const finishPercent = Math.round((temperature - min) / percent);
  const lineFinishPercent = lineMin + linePercent * finishPercent;
  const roundFinishPercent = roundMin + roundPercent * finishPercent;
  dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
  dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg`;
  dom.temperature.innerText = temperature;
}
}



function changeTemperature(){
let mouseover = false;
let mousedown = false;
let position = 0;
let range = 0;
let change = 0;
dom.temperatureBtn.onmouseover = () => mouseover = true;
dom.temperatureBtn.onmouseout = () => mouseover = false;
dom.temperatureBtn.onmouseup = () => mousedown = false;
dom.temperatureBtn.onmousedown = (e) => {
   mousedown = true;
   position = e.offsetY;
   range = 0;
}
dom.temperatureBtn.onmousemove = (e) => {
  if (mouseover && mousedown) {
    range = e.offsetY - position;
    const newChange = Math.round(range / -50);
    if (newChange != change) {
      let temperature = +dom.temperature.innerText;
      if (newChange < change) {
        temperature = temperature - 1;
      } else {
        temperature = temperature + 1;
      }
      change = newChange;
      roomsData[activeRoom].temperature = temperature
      renderTemperature(temperature);
    }
  }  
}
}
changeTemperature()

/* Сохранение температуры */
dom.temperatureSaveBtn.onclick = () => {
 const temperature = +dom.temperature.innerText;
 roomsData[activeRoom].temperature = temperature
 alert('Температура установлена!')
}

/* Отключение обогрева */
dom.temperaturePowerBtn.onclick = () => {
const power = dom.temperaturePowerBtn
power.classList.toggle('off');
if (power.matches('.off')){
  roomsData[activeRoom].temperatureOff = true;
} else {
  roomsData[activeRoom].temperatureOff = false;
}
}
/* Установка значения кнопки включения температуры */
function setTemperaturePower(){
if (roomsData[activeRoom].temperatureOff) {
  dom.temperaturePowerBtn.classList.add('off');
} else {
  dom.temperaturePowerBtn.classList.remove('off');
}
}

dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
  tab.onclick = () => {
    const optionType = tab.dataset.type
    activeTab = optionType
    changeSettingsType(optionType)
  }
})


function changeSettingsType(type) {
  const tabSelected = dom.settingsTabs.querySelector('.tab.selected')
  const panelSelected = dom.settingsPanels.querySelector('.selected');
  const tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
  const panel = dom.settingsPanels.querySelector(`[data-type=${type}]`);
  tabSelected.classList.remove('selected');
  panelSelected.classList.remove('selected');
  tab.classList.add('selected');
  panel.classList.add('selected');


}

function changeSlider(percent, slider) {
  if (percent >= 0 && percent <= 100){
    slider.querySelector('span').innerText = percent;
    slider.style.height = `${percent}%`;
  }
}
 
function watchSlider(slider) {
  let mouseover = false;
  let mousedown = false;
  let position = 0;
  let range = 0;
  let change = 0;
  slider.onmouseover = () => mouseover = true;
  slider.onmouseout = () => mouseover = false;
  slider.onmouseup = () => mousedown = false;
  slider.onmousedown = (e) => {
   mousedown = true;
   position = e.offsetY;
   range = 0;
}
  dslider.onmousemove = (e) => {
  if (mouseover && mousedown) {
    range = e.offsetY - position;
    const newChange = Math.round(range / -50);
    if (newChange != change) {
      let temperature = +dom.temperature.innerText;
      if (newChange < change) {
        temperature = temperature - 1;
      } else {
        temperature = temperature + 1;
      }
      change = newChange;
      roomsData[activeRoom].temperature = temperature
      renderTemperature(temperature);
    }
  }  
}
}
