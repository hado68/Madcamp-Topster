# PlayBack!

## Preview

---

![image](https://github.com/user-attachments/assets/6d6f5a7d-17b6-4919-a41d-aa302fffcb0c)


### 당신의 최애 앨범들을 감상해보세요!

**음악을 좋아하는 사람이라면 자기가 좋아하는 앨범들을**

**전시하고 알리고 싶다는 생각을 해본 적이 있을 겁니다**

> **PlayBack!은 음악 애호가들을 위한 복합 전시 공간입니다**
> 

> **여러분들이 선택한 앨범으로 시시각각 변하는 전시 공간, PlayBack!을 이용해 보세요**
> 

## Team

---

문재혁

https://github.com/Kiriiin

하도현

https://github.com/hado68


## Stack

---

- **Framework**: Next.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **SDK**: Spotify Web Playback SDK
- **API**: Spotify Web API

## Details

---

### 로그인 화면

![image](https://github.com/user-attachments/assets/6dc47162-3bc1-473b-bd7b-13bf37420789)


- Spotify API를 통해 로그인 할 수 있는 로그인 화면입니다.
- 사이트 메인 컨셉인 LP를 테마로 팝아트 느낌으로 구성된 배경 화면을 직접 제작했습니다.

### 앨범 진열대 화면

![image](https://github.com/user-attachments/assets/db89a57b-11f6-4a19-ae1b-894448d4b3e3)


- 내가 선택한 앨범들을 한 눈에 볼 수 있는 진열대 입니다.
- 앨범의 LP판들이 진열대 안에 눕혀져 있고, 마우스를 올리면 해당하는 LP판이 들어 올려집니다.
- 왼쪽의 검색 탭으로 Spotify API에서 앨범들을 검색할 수 있으며, 클릭 시 진열대에 추가됩니다.
- 검색어에는 가수 이름, 앨범 이름, 노래 제목과 같은 연관 키워드들로 검색할 수 있습니다.
- 앨범을 삭제하고 싶으면 삭제하고 싶은 앨범을 밖으로 끌어 놓음으로써 삭제할 수 있습니다.

https://github.com/user-attachments/assets/541e60ca-de0b-4815-9a7a-a2f8d06ab2a3

https://github.com/user-attachments/assets/e0ccba91-46e1-40f2-9d12-e6a460780d03


- LP판을 클릭하면 해당하는 LP판이 확대되고, 마우스를 움직이며 LP판을 여러 각도에서 감상할 수 있습니다.
- LP판이 움직임에 따라 LP에 비춰지는 빛을 다르게 하여, 입체감을 조성하였습니다.
- 선택된 LP판을 다시 한 번 클릭하면 해당 앨범을 재생할 수 있는 Player 화면으로 넘어갑니다.

### Player 화면

![image](https://github.com/user-attachments/assets/a1726817-9120-4ca7-a597-48782edf3082)


- 앨범을 재생할 수 있는 Player 화면입니다.
- Spotify API를 사용해 sidebar에 앨범 트랙들을 불러오고 재생할 수 있습니다.
- Go Back 버튼을 통해 이전 화면으로 돌아갈 수 있습니다.

https://github.com/user-attachments/assets/96548990-fd37-4dc6-a21f-488a012bca47


- 해당하는 앨범의 이미지를 particle로 표현하여 재밌는 Interaction이 가능하도록 구현했습니다.
- 앨범 이미지와 노래를 온전히 감상할 수 있도록 sidebar 밖으로 마우스를 빼내면 sidebar가 표시되지 않도록 하였습니다.
- 화면을 클릭하면 각 particle이 흩어졌다가, 돌아오도록 하였습니다.

### TurnTable 화면

![image](https://github.com/user-attachments/assets/aaf17b1c-5e04-4501-88a9-4e661e142182)


- 선택한 앨범들을 감상할 수 있는 턴 테이블 페이지입니다.
- LP 턴 테이블에서 영감을 받아 앨범들을 회전 시키며 감상할 수 있도록 하였습니다.
- LP와 회전하는 매체라는 공통점을 가진 영사기의 콘셉트를 가져와 배경에 앨범들을 마치 영사기에 비친 영화처럼 표현했습니다.

https://github.com/user-attachments/assets/186a22fb-4674-41a3-ad89-4c1cc0ba4c6e


- 앨범을 드래그하여 시계, 반시계 방향으로 회전시킬 수 있고, 이에 따라 영사기로 비춰지는 앨범도 바뀌게 됩니다. 이때 영사기의 필름도 같이 회전하게 됩니다.
- 영사기에서 나온 화면의 느낌을 주기 위해 채도를 낮춘 필터를 씌운 앨범 이미지를 시간에 따른 Sin함수로 그린 후 특정 값 기준으로 값을 인코딩하여 그렸습니다.
- Go Back 버튼을 통해 이전 화면으로 돌아갈 수 있습니다.

## Review

---

재혁: 호기롭게 디자인에 도전했지만, 역시 생각보다 더 쉽지 않다는 걸 느꼈다. 애니메이션 라이브러리가 있는 줄 모르고 그냥 다 짰더니 너무 힘들었다.
번외로 다음 학기 OS 플메를 구할 수 있어서 좋았다. 우하핳

도현: 평소에 유튜브로만 봤던 인터렉션을 직접 구현해보면서 재미를 느낄 수 있었다. 프론트를 하는데 생각보다 엄청난 노고가 들어간다는 것도 알게 되었다. 여러모로 재미있는 한 주였다.
