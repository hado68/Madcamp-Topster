import React, { useRef, useEffect } from 'react';
import { Polygon } from './Polygon';

const IMAGE_URLS = [
  '/albums/cover1.jpg',
  '/albums/cover2.jpg',
  '/albums/cover3.jpg',
  '/albums/cover4.jpg',
  '/albums/cover5.jpg',
  '/albums/cover6.jpg',
  '/albums/cover1.jpg',
  '/albums/cover2.jpg',
  '/albums/cover3.jpg',
  '/albums/cover4.jpg',
  '/albums/cover5.jpg',
  '/albums/cover6.jpg',
  '/albums/cover1.jpg',
  '/albums/cover2.jpg',
  '/albums/cover3.jpg',
  '/albums/cover4.jpg',
  '/albums/cover5.jpg',
  '/albums/cover6.jpg'
];

const TurnTableComponent = () => {
  const canvasRef = useRef(null);
  const pixelRatio = typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 2 : 1;

  let isDown = false;
  let moveX = 0;
  let moveY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let polygon = null;
  let filmWheelImage = null;
  let projectorImage = null;
  let filmWheelRotation = 0;

  // 물결 효과를 위한 변수
  let time = 0;

  const loadImages = () => {
    filmWheelImage = new Image();
    filmWheelImage.src = '/FilmWheel.svg';

    projectorImage = new Image();
    projectorImage.src = '/Projector.svg';

    return IMAGE_URLS.map((url) => {
      const img = new Image();
      img.src = url;
      return img;
    });
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const stageWidth = window.innerWidth;
      const stageHeight = window.innerHeight;

      canvas.width = stageWidth * pixelRatio;
      canvas.height = stageHeight * pixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(pixelRatio, pixelRatio);

      ctx.fillStyle = '#252b2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const images = loadImages();
      polygon = new Polygon(stageWidth / 20, stageHeight / 2, stageHeight, 16, images);
    }
  };

  const drawWave = (ctx, img, x, y, width, height) => {
    const amplitude = 10000; // 물결의 진폭
    const frequency = 0.7; // 물결의 주파수

    // 흑백 이미지 그리기
    ctx.save();
    ctx.filter = 'grayscale(20%) blur(8px)';
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    // 그라디언트를 적용할 경로를 만듭니다.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 0; i <= width; i++) {
        const dy = (amplitude * Math.sin((i * frequency) + time) < height / 5) ? 0 : height;
        ctx.lineTo(x + i, y + dy);
    }

    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.clip();

    ctx.save();
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    // 색상 그라디언트 적용
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.2)');

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'overlay';
    ctx.fill();
    ctx.restore();

    ctx.restore();
  };

  const drawfilmWheel = (ctx, rotation) => {
    if (filmWheelImage) {
      const canvas = canvasRef.current;
      const canvasWidth = canvas.width / pixelRatio;
      const canvasHeight = canvas.height / pixelRatio;
      
      // 이미지 크기를 캔버스의 1/30로 설정
      const leftSize = Math.min(canvasWidth, canvasHeight) / 21;
      const rightSize = Math.min(canvasWidth, canvasHeight) / 28;
      
      // 왼쪽 비닐 (기존 위치)
      const leftCenterX = canvasWidth * 0.71;
      const leftCenterY = canvasHeight * 0.67;
  
      // 오른쪽 비닐 (새로운 위치)
      const rightCenterX = leftCenterX + canvasWidth * 0.018;  // 오른쪽으로 이동
      const rightCenterY = leftCenterY * 1.004; // 높이는 동일
  
      // 왼쪽 비닐 그리기
      ctx.save();
      ctx.translate(leftCenterX, leftCenterY);
      ctx.rotate(rotation);
      ctx.drawImage(filmWheelImage, -leftSize / 2, -leftSize / 2, leftSize, leftSize);
      ctx.restore();
  
      // 오른쪽 비닐 그리기
      ctx.save();
      ctx.translate(rightCenterX, rightCenterY);
      ctx.rotate(-1 * rotation);
      ctx.drawImage(filmWheelImage, -rightSize / 2, -rightSize / 2, rightSize, rightSize);
      ctx.restore();

      // 프로젝터 이미지 크기 설정 (비닐보다 약간 크게)
      const projectorSize = leftSize * 1.4;

      // 왼쪽 프로젝터 그리기
      ctx.save();
      ctx.translate(leftCenterX - leftSize * 0.4, leftCenterY + leftSize * 0.9); // 비닐 아래에 위치
      ctx.drawImage(projectorImage, -projectorSize / 2, -projectorSize / 2, projectorSize * 1.8, projectorSize / 1.5);
      ctx.restore();
    }
  };

  const animateCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);

      if (polygon && polygon.backgroundImage) {
        const img = polygon.backgroundImage;
        const imgAspectRatio = img.width / img.height;
        const canvasWidth = canvas.width / pixelRatio;
        const canvasHeight = canvas.height / pixelRatio;

        let drawWidth, drawHeight;

        drawWidth = canvasWidth * 0.5;
        drawHeight = drawWidth / imgAspectRatio;

        const x = (canvasWidth - drawWidth) / 2;
        const y = (canvasHeight - drawHeight) / 2;

        ctx.filter = 'blur(8px)';
        drawWave(ctx, img, x, y, drawWidth, drawHeight);
        ctx.filter = 'none';

        time += 0.05;
      } else {
        ctx.fillStyle = '#252b2e';
        ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
      }

      moveX *= 0.85;
      moveY *= 0.85;

      if (polygon) {
        
        polygon.animate(ctx, moveX, moveY);
        filmWheelRotation = -polygon.rotate; // polygon의 rotate 값을 사용
        drawfilmWheel(ctx, filmWheelRotation);
      }

      requestAnimationFrame(animateCanvas);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      requestAnimationFrame(animateCanvas);

      const handlePointerDown = (e) => {
        isDown = true;
        moveX = 0;
        moveY = 0;
        offsetX = e.clientX;
        offsetY = e.clientY;
      };

      const handlePointerMove = (e) => {
        if (isDown) {
          moveX = e.clientX - offsetX;
          moveY = e.clientY - offsetY;
          offsetX = e.clientX;
          offsetY = e.clientY;
        }
      };

      const handlePointerUp = () => {
        isDown = false;
      };

      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default TurnTableComponent;