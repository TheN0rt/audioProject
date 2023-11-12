// let audio = new Audio()
let songs = [];
let currentSong = {};
let isRepeatMode = false;
let isMuted = false;
let previousVolume;

// Create an instance of wave surfer with its configuration
var Spectrum = WaveSurfer.create({
   container: '#audio-spectrum',
   progressColor: "#03a9f4"
});

// Получение списка песен
const getSongs = async () => {
   if(localStorage.getItem('songs')){
      songs = JSON.parse(localStorage.getItem('songs')) 
   } else{
      const response = await fetch('/audioProject/src/data/data.json')
      const data = await response.json()
      songs = data
      localStorage.setItem('songs', JSON.stringify(songs))
   }
} 

// Запись песен в список на странице
const setSongs = async () => {
   await getSongs()
   const ul = document.querySelector('.sidebar ul')

   for(let song of songs){
      let li = document.createElement('li')
      li.setAttribute('data-type', song.id)
      li.innerHTML = `<span>${song.songName + ' '}</span><span>${' -' + song.artistName}</span>`
      ul.appendChild(li)
   }
}

const debounce = (callback, delay) => {
   let timer;

   return function(...args){
      clearTimeout(timer)
      timer = setTimeout(() => {
         callback.apply(this, args)
      }, delay)
   }
}

// Функция для управления громкостью аудио
function changeVolume(e) {
   let volume = e.target.value;
   if(isMuted){
      previousVolume = volume / 100
   } else{
      Spectrum.setVolume(volume / 100)
      previousVolume = Spectrum.getVolume()
   }
}

let setVolumeAfterChange = debounce((volume) => Spectrum.setVolume(volume), 100)

const setRepeatMode = () => {
   isRepeatMode = !isRepeatMode
}

const setMuteMode = () => {
   isMuted = !isMuted
   muteVolumeBtn.src = isMuted ? '/audioProject/src/assets/img/icons/musicNoteSlash.png' : '/audioProject/src/assets/img/icons/musicNote.png' 
   isMuted ? Spectrum.setVolume(0) : Spectrum.setVolume(previousVolume)
}

function formatTime(time) {
   time = Math.round(time);
   let minutes = Math.floor(time / 60);
   let seconds = time % 60;
   if (minutes < 10) {
      minutes = '0' + minutes;
   }
   if (seconds < 10) {
      seconds = '0' + seconds;
   }
   return minutes + ':' + seconds;
}

// Функция для проигрывания песни
function playSong() {
   Spectrum.play()
   playPauseBtn.children[0].src = '/audioProject/src/assets/img/icons/pause.png';
}

// Функция для остановки проигрывания песни
function pauseSong() {
   Spectrum.pause()
   playPauseBtn.children[0].src = '/audioProject/src/assets/img/icons/play-button-arrowhead.png';
}

// Следующая песня
const nextSong = () => {
   let id = songs.indexOf(currentSong)
   if(id < songs.length - 1){
      currentSong = songs[id+1]
      // Надо переделать в промисы
      Spectrum.load(currentSong.src)
      setTimeout(() => {
         if(playPauseBtn.classList.contains('play')){
            playSong()
         }
      }, 1500)
   }
}

// Предыдущая песня
const previousSong = () => {
   let id = songs.indexOf(currentSong)
   if(id > 0){
      currentSong = songs[id-1]
      // Надо переделать в промисы
      Spectrum.load(currentSong.src)
      setTimeout(() => {
         if(playPauseBtn.classList.contains('play')){
            playSong()
         }
      }, 1500)
   }
}