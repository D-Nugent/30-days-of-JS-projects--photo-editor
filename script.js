// Upload Image Logic

let img;
let fileName;

const uploadImgToCanvas = (e) => {
  canvas.style.display = 'flex';
  let reader = new FileReader();
  reader.onload = (e) => {
    img = new Image();
    img.onload = (e) => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img,0,0)
    }
    img.src = e.target.result;
  }
  reader.readAsDataURL(e.target.files[0])
  fileName = e.target.files[0].name;
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const uploadNode = document.querySelector('.upload-fields__file-handler');
uploadNode.addEventListener('change',uploadImgToCanvas)

// Image Tools Logic

const imageLoaded = () => {
  let canvasData = ctx.getImageData(0,0,canvas.width,canvas.height);
  return canvasData.data.some(channel => channel !== 0)
}

let currentFilters = {}

const applyFilter = (target) => {
  if (!imageLoaded()) return;
  const {name,value,dataset} = target;
  const filterValue = value+dataset.measurement;
  const outputNode = document.querySelector(`output[name='${name}']`);
  outputNode.innerText = value;
  currentFilters[name] = `${name}(${filterValue})`;
  ctx.filter = Object.values(currentFilters).join(' ');
  ctx.drawImage(img,0,0);
  // The below would set the css variables which work visually but do not
  // edit the canvas directly.
  // document.documentElement.style.setProperty(`--${name}`, filterValue);
}

const resetFilters = (e) => {
  let defaultValue = {
    blur:0,
    brightness:100,
    contrast:100,
    grayscale:0,
    'hue-rotate':0,
    invert:0,
    saturate:100,
    sepia:0
  }
  toolInputs.forEach(input => {
   input.value = defaultValue[input.name];
   applyFilter(input);
  })
}

const toolInputs = document.querySelectorAll('.tools__range');
toolInputs.forEach(input => {
  input.addEventListener('change',(e)=>applyFilter(e.target));
  input.addEventListener('mousemove',(e)=>applyFilter(e.target));
})
const resetBtn = document.querySelector('.tools__reset');
resetBtn.addEventListener('click',resetFilters)

// Download Image Logic

const downloadImage = (e) => {
  let img = canvas.toDataURL('image/png').replace('image/png','image/octet-stream');
  let tempLink = document.createElement('a');
  tempLink.download = `${fileName}-edited.png`;
  tempLink.href = img;
  tempLink.click();
  tempLink.remove();
}

const downloadBtn = document.querySelector('.tools__download');
downloadBtn.addEventListener('click',downloadImage)