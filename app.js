const audio = new Audio('./baby-s-on-fire-slowed.mp3');
audio.volume = 0.5;

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.height = 100;

const okakText = document.querySelector('.okak-text');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

function getFFTSize() {
    const w = window.innerWidth;
    if (w < 768) return 128;
    return 256;
  }

let bufferLength;
let dataArray;

function setupAnalyser() {
  analyser.fftSize = getFFTSize();
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  canvas.width = window.innerWidth;
}

setupAnalyser();
window.addEventListener('resize', setupAnalyser);

function draw() {
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
  
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
  
      const t = i / bufferLength;

        const r = Math.round((1 - t) * 50 + t * 255);
        const g = 0;
        const b = Math.round((1 - t) * 255 + t * 50);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 20;
  
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  
    requestAnimationFrame(draw);
  }
  

let isFirstClick = true;
let isPlaying = false;
let hasStartedDrawing = false;

okakText.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    okakText.classList.remove('neon-text');
  } else {
    if (isFirstClick) {
      audioCtx.resume();
      audio.currentTime = 0;
      isFirstClick = false;
    }

    audio.play();
    okakText.classList.add('neon-text');

    if (!hasStartedDrawing) {
      draw();
      hasStartedDrawing = true;
    }
  }
  isPlaying = !isPlaying;
});
