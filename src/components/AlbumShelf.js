import { useEffect, useRef, useState } from 'react';

const AlbumShelf = () => {
  const canvasRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 캔버스 크기 조정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 배경 이미지 로드
    const bgImage = new Image();
    bgImage.src = '/texture/shelf_walnut_wood_texture.jpg';
    bgImage.onload = () => {
      drawScene();
    };

    // 선반의 너비, 높이 설정
    const shelfWidth = 900;
    const shelfHeight = 18;
    const shelfDepth = 12; // 선반 깊이
    const shelfShadowOffset = 5; // 선반 그림자 오프셋

    // 앨범 커버 크기
    const albumWidth = 130;
    const albumHeight = 130;
    const albumShrinkFactor = 0.6;

    // 선반 위치 (조정된 값)
    const shelfYPositions = [170, 370, 570];

    // 앨범 커버 위치 저장
    const albumPositions = [
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ];

    function drawShelf(y) {
      const wood_shelf_texture = new Image();
      wood_shelf_texture.src = '/texture/shelf_walnut_wood_texture.jpg'; // 나무 질감 이미지 경로
      wood_shelf_texture.onload = () => {
        // 선반 그림자
        ctx.save();
        ctx.shadowOffsetX = shelfShadowOffset;
        ctx.shadowOffsetY = shelfShadowOffset;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
        // 선반 그리기
        ctx.drawImage(wood_shelf_texture, (canvas.width - shelfWidth) / 2, y, shelfWidth, shelfHeight);
        
        // 그림자 효과 리셋
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        
        ctx.restore();
        
        // 선반 깊이를 위한 사다리꼴 그리기
        ctx.save();
        ctx.beginPath();
        ctx.moveTo((canvas.width - shelfWidth) / 2, y);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + shelfWidth, y);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + shelfWidth - shelfDepth, y - shelfDepth);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + shelfDepth, y - shelfDepth);
        ctx.closePath();
        ctx.clip();
        
        // 사다리꼴 이미지와 그림자
        ctx.shadowOffsetX = shelfShadowOffset;
        ctx.shadowOffsetY = shelfShadowOffset;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
        ctx.drawImage(wood_shelf_texture, (canvas.width - shelfWidth) / 2, y - shelfDepth, shelfWidth, shelfDepth);
        
        // 그림자 효과 리셋
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        
        // 어두운 색상 오버레이
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect((canvas.width - shelfWidth) / 2, y - shelfDepth, shelfWidth, shelfDepth);
        
        ctx.restore();
        
        // 다리 그리기
        const legWidth = 9;
        const legHeight = 30;
        const legOffset = 4; // 다리 기울기 조절
        const legPos = 40;
        

        // 왼쪽 다리 그림자
        ctx.save();
        ctx.fillStyle = '#000'; // 검은색
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; 
        
        // 왼쪽 다리 (기울어진 평행사변형)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo((canvas.width - shelfWidth) / 2 - legWidth + legPos, y + shelfHeight);
        ctx.lineTo((canvas.width - shelfWidth) / 2 - legWidth + legPos + legOffset, y + shelfHeight + legHeight);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + legPos + legOffset, y + shelfHeight + legHeight);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + legPos, y + shelfHeight);
        ctx.closePath();
        ctx.fill();
        
        // 오른쪽 다리 그림자
        ctx.save();
        ctx.fillStyle = '#000'; // 검은색
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';   

        // 오른쪽 다리 (기울어진 평행사변형)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo((canvas.width - shelfWidth) / 2 + shelfWidth - legWidth - legPos, y + shelfHeight);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + shelfWidth - legWidth - legPos - legOffset, y + shelfHeight + legHeight);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + shelfWidth - legPos - legOffset, y + shelfHeight + legHeight);
        ctx.lineTo((canvas.width - shelfWidth) / 2 + shelfWidth - legPos, y + shelfHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
    }
    
    function drawAlbumCover(src, x, y, albumShrinked) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        // 앨범 그림자
        ctx.save();
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

        if (albumShrinked == true){
          ctx.drawImage(img, x, y, albumWidth * albumShrinkFactor, albumHeight * albumShrinkFactor);
          // 앨범 커버 가장자리 하이라이트
          ctx.strokeStyle = '#FFF'; // 흰색
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, albumWidth * albumShrinkFactor, albumHeight * albumShrinkFactor);
        }
        else {
          ctx.drawImage(img, x, y, albumWidth, albumHeight);    
          // 앨범 커버 가장자리 하이라이트
          ctx.strokeStyle = '#FFF'; // 흰색
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, albumWidth, albumHeight);      
        }

        // 그림자 효과 리셋
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        ctx.restore();
      };
    }

    function drawScene() {
      // 캔버스 클리어
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // 전체 배경 색상 설정 (어두운 하얀색)
      ctx.fillStyle = '#dcdcdc'; // 하얀색으로 설정하고 약간 어두운 색상으로 조정
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    
      // 선반 그리기
      shelfYPositions.forEach(y => drawShelf(y));
    
      // 앨범 커버 그리기
      const albumCovers = [
        '/albums/cover1.jpg',
        '/albums/cover2.jpg',
        '/albums/cover3.jpg',
        '/albums/cover4.jpg',
        '/albums/cover5.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg',
        '/albums/cover6.jpg'
      ];
    
      
      const firstRowAlbumNum = 4;
      const nextRowAlbumNum = 7


      for (let i = 0; i < firstRowAlbumNum; i++) {
        const x = (canvas.width - shelfWidth) / 2 + 80 + (i % firstRowAlbumNum) * (albumWidth + 80);
        const y = shelfYPositions[Math.floor(i / firstRowAlbumNum)] - albumHeight - shelfDepth + 9; // 앨범 밑단이 선반 뒤로 가도록 조정
        albumPositions[i] = { x, y };
        drawAlbumCover(albumCovers[i], x, y, false);
      }

      for (let i = firstRowAlbumNum; i < albumCovers.length; i++) {
        const x = (canvas.width - shelfWidth) / 2 +  + (i % nextRowAlbumNum) * (albumWidth * albumShrinkFactor + 50);
        const y = shelfYPositions[Math.floor( (i - firstRowAlbumNum) / nextRowAlbumNum) + 1] - albumHeight * albumShrinkFactor - shelfDepth + 9; // 앨범 밑단이 선반 뒤로 가도록 조정
        albumPositions[i] = { x, y };
        drawAlbumCover(albumCovers[i], x, y, true);
      }
    }
    

    // 윈도우 크기 조정 시 캔버스 크기 조정
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawScene(); // 크기 조정 후 다시 그리기
    });

    return () => {
      window.removeEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawScene();
      });
    };
  }, [hoveredIndex]);

  return (
    <canvas ref={canvasRef} style={{ display: 'block', margin: 0, padding: 0, border: 'none' }}></canvas>
  );
};

export default AlbumShelf;
