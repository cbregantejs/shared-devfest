import './style.css'

const shareButton = document.getElementById('shareButton');
const photoUser = document.getElementById('photoUser') as HTMLDivElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const container = document.getElementById('container');

if (fileInput) {
  fileInput.addEventListener('change', function(e) {
    const file = (e.target as HTMLInputElement).files?.[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      if (photoUser) {
        photoUser.style.backgroundImage = `url(${event?.target?.result})`;
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });
}


const generateButton = document.getElementById('generateButton');
if (generateButton) {
  generateButton.addEventListener('click', function() {
    
    if(container && photoUser) {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if(context){
        const img = new Image();
        img.onload = function() {
          context.drawImage(img, 0, 0, width, height);

          const photoUserImg = new Image();
          photoUserImg.onload = function() {
            context.save();
            context.beginPath();
            context.arc(width / 2, height / 2, photoUser.offsetWidth / 2, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            context.drawImage(photoUserImg, (width - photoUser.offsetWidth) / 2, (height - photoUser.offsetHeight) / 2, photoUser.offsetWidth, photoUser.offsetHeight);
            context.restore();
            
            const link = document.createElement('a');
            link.download = 'devfest2023.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          };
          photoUserImg.src = photoUser.style.backgroundImage.slice(5, -2);
        };

        img.src = "./template.png";
      }
    }
    
  });
}

if (shareButton) {
  shareButton.addEventListener('click', async function() {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('container');
    const width = container?.offsetWidth || 0;
    const height = container?.offsetHeight || 0;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (context) {
      const img = new Image();
      img.onload = function() {
        context.drawImage(img, 0, 0, width, height);

        const photoUserImg = new Image();
        photoUserImg.crossOrigin = "anonymous"; 
        photoUserImg.onload = function() {
          const radius = Math.min(width, height) / 4; 

          const scaleFactor = radius * 2 / Math.min(photoUserImg.width, photoUserImg.height);
          const scaledWidth = photoUserImg.width * scaleFactor;
          const scaledHeight = photoUserImg.height * scaleFactor;

          context.save();
          context.beginPath();
          context.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
          context.closePath();
          context.clip();
          context.drawImage(
            photoUserImg,
            (width - scaledWidth) / 2,
            (height - scaledHeight) / 2,
            scaledWidth,
            scaledHeight
          );
          context.restore();

          canvas.toBlob(async function(blob) {
            if (blob) {
              const file = new File([blob], 'devfest2023.png', { type: 'image/png' });

              try {
                await navigator.share({
                  files: [file],
                });
              } catch (error) {
                console.log(error);
              }
            }
          });
        };

        const photoUser = document.getElementById('photoUser') as HTMLDivElement;
        if (photoUser) {
          const url = photoUser.style.backgroundImage?.slice(5, -2).replace(/"/g, '');
          photoUserImg.src = url;
        }
      };

      img.src = "./template.png";
    }
  });
}

