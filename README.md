# AI_Artist App

#### 1. 홈화면
<img src="https://user-images.githubusercontent.com/66655076/164369125-958b7f27-1344-41ed-916d-3959af99c439.png" width="250" height="400">
## 처음 앱을 켰을 때 보이는 화면

#### 2. 로그인 화면
<img src="https://user-images.githubusercontent.com/66655076/164369151-55f02d81-4a46-4de8-8e1c-37375b2ef32d.png" width="250" height="400">


#### 3. 원하는 화가의 그림 선택 화면
<img src="https://user-images.githubusercontent.com/66655076/164369190-345f59b9-50fb-473d-9577-ce3c1a7060ce.png" width="250" height="400">
## 사진에 적용하고 싶은 필터를 선택할 수 있습니다.

#### 4. 편집할 사진 선택
<div>
  <img src="https://user-images.githubusercontent.com/66655076/164369276-c36221f7-1214-434e-9cc1-cc670a086598.png" width="250" height="400">
  <img src="https://user-images.githubusercontent.com/66655076/164369357-163d980b-e656-41aa-9b04-d6dfc8c04036.png" width="250" height="400">
</div>

#### 5. 완성된 그림
<img src="https://user-images.githubusercontent.com/66655076/164369414-22473e0f-96e8-460a-89bd-5aef70f941ac.png" width="250" height="400">

#### 6. 작품 목록과 편집
<div>
  <img src="https://user-images.githubusercontent.com/66655076/164369470-8eb24929-4b36-45aa-ad69-01a3b90d8f95.png" width="250" height="400">
  <img src="https://user-images.githubusercontent.com/66655076/164369525-7ca31eef-6ded-4adc-ae3d-046da58e26fa.png" width="250" height="400">
</div>

#### 7. 실행되는 동영상
https://user-images.githubusercontent.com/66655076/164369616-8d4aa65d-623f-440d-9474-23ae36cfa66d.mp4

#### 8. 수상
![image](https://user-images.githubusercontent.com/66655076/164369729-05ab0091-9674-4bd9-a9b3-feccce97c717.png)

#### 9. 간단한 서버 부분 설명과 느낀점
<설명>
## node.js를 사용해서 서버 애플리케이션을 개발했습니다. 데이터베이스는 mysql을 사용하였고
## 테이블은 총 4개로 유저, 미술품(필터), 완성품, 작업공간으로 구성하였습니다.
## 서버는 amazon aws에서 ex2를 사용하였습니다. 

<어려웠던 점>
## 서버 쪽에서 인공지능 모델 처리를 해주려다보니 모델을 서버에 저장시켜서 모델을 실행시켜주는 방향으로 진행했습니다.
## 그래서 python을 실행시켜주는 모듈인 spawn을 사용했고 모델 작업이 끝나면 google firebase 저장소에 업로드해서 결과물을 받는 방식으로 진행하였습니다.
## 처음 사용해보는 모듈인 spawn과 firebase storage를 사용하려다보니 어려움이 있었지만 많은 시행착오 끝에 흐름을 이해하고 자료를 검색하고 공부하다 보니 해결할 수 있었습니다.
