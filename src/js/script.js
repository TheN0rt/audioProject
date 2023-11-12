const audioPlayer = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPause');
const backFarwardBtn = document.querySelector('#backFarward');
const skipFarwardBtn = document.querySelector('#skipFarward');
const repeatBtn = document.querySelector('#repeatMode');
const muteVolumeBtn = document.querySelector('#mute');
 
window.addEventListener("resize", function(){
   // Get the current progress according to the cursor position
   var currentProgress = Spectrum.getCurrentTime() / Spectrum.getDuration();

   // Reset graph
   Spectrum.empty();
   Spectrum.drawBuffer();
   // Set original position
   Spectrum.seekTo(currentProgress);
}, false);

 // Обработчик события на ползунок громкости
document.querySelector('.volume-range').addEventListener("input", changeVolume);

const setInfoAboutSong = (obj) => {
   document.querySelector('.audio__info .song__name').innerText = obj.songName
   document.querySelector('.audio__info .artist__name').innerText = obj.artistName.length === 1 ? obj.artistName : obj.artistName.join(',')
   document.querySelector('.audio__info img').src = obj.album.img.src ? obj.album.img.src : '/audioProject/src/assets/img/albums/altSongImg.png'
}

const updateProgressSong = (currentTime, duration) => {
   const progress = (currentTime / duration) * 100;
   document.getElementById('currentTime').innerHTML = formatTime(currentTime);
   document.querySelector(".slider-range").value = progress
}

document.querySelector(".slider-range").addEventListener("input", (e) => {
   const progress = e.target.value;
   const currentTime = (progress / 100);
   Spectrum.setVolume(0)
   Spectrum.seekTo(currentTime);
   setVolumeAfterChange(previousVolume)
});

playPauseBtn.addEventListener('click', () => {
   playPauseBtn.classList.toggle('play')

   if(!playPauseBtn.classList.contains('play')){
      pauseSong()
   } else{
      playSong()
   }
});

skipFarwardBtn.addEventListener('click', () => {
   nextSong()
   setInfoAboutSong(currentSong)
})

backFarwardBtn.addEventListener('click', () => {
   previousSong()
   setInfoAboutSong(currentSong)
})

repeatBtn.addEventListener('click', () => {
   setRepeatMode()
   document.querySelector('#repeatMode img').src = isRepeatMode ? '/audioProject/src/assets/img/icons/repeat.png' : '/audioProject/src/assets/img/icons/nonRepeat.png'
})

muteVolumeBtn.addEventListener('click', () => {
   setMuteMode()
})

// Ивент библиотеки во время проигрывания песни 
Spectrum.on('audioprocess', function() {
   const currentTime = Spectrum.getCurrentTime();
   const duration = Spectrum.getDuration(); 
   document.getElementById('currentTime').innerHTML = formatTime(currentTime);
   document.querySelector('#duration').innerText = formatTime(duration)
   updateProgressSong(currentTime, duration)
   if(Math.floor(currentTime) === Math.floor(duration)){
      if(isRepeatMode){
         setTimeout(() => {
            playSong()
         }, 1500)
      } else{
         nextSong()
         setInfoAboutSong(currentSong)
      }
   }
});

window.onload = async () => {
   await setSongs()

   document.querySelectorAll('.sidebar ul li').forEach(el => {
      el.addEventListener('click', (e) => {
         let li = e.target.closest('li'); // получаем ближайший 
         let id = Number(li.getAttribute('data-type'))
         currentSong = songs.find(el => id === el.id)
         let src = currentSong.src
         // Промис тут нужен
         Spectrum.load(src)
         setTimeout(() => {
            playPauseBtn.classList.add('play')
            playSong()
            setInfoAboutSong(currentSong)
         }, 1500)
      }, { capture: true })
   })
}