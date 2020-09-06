var container = document.getElementById ('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng (33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map (container, options); //지도 생성 및 객체 리턴

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places ();

// mask API 사용위해 request URL 가져오기
let base_mask_url =
  'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json';

// map이 만들어 졌을 때도 marker 띄우기
let mapCenter = map.getCenter ();
let mapCenterOld = mapCenter;

getMaskDataAndDrawMarker (mapCenter.Ha, mapCenter.Ga);

// 버튼 누르거나 Enter 눌렀을 때 검색이 되도록 만들기
let search_btn = document.querySelector ('.search-btn');
let search_bar = document.querySelector ('#search-bar');

console.log (search_btn);
console.log (search_bar);

search_btn.addEventListener ('click', () => {
  let keyword = search_bar.value;
  if (keyword) {
    console.log (keyword + ' 검색하셨습니다.');
    keywordSearch (keyword);
  } else {
    alert ('검색어를 입력해주세요.');
  }
});

search_bar.addEventListener ('keyup', () => {
  // keycode 13 = Enterkey
  if (event.keycode) {
    search_btn.click ();
  }
});

// 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트 등록
kakao.maps.event.addListener (map, 'center_changed', function () {
  mapCenter = map.getCenter ();

  // 위도 1도의 거리 (km단위) = 6400 * 2 * 3.14 / 360.
  // X = ( cos( 위도#1 ) * 6400 * 2 * 3.14 / 360 ) * | 경도#1 - 경도#2 |
  // Y = 111 * | 위도#1 - 위도#2 |

  let X =
    Math.cos (mapCenter.Ha) *
    6400 *
    2 *
    3.14 /
    360 *
    Math.abs (mapCenter.Ga - mapCenterOld.Ga);
  let Y = 111 * Math.abs ((mapCenter.Ha = mapCenterOld.Ha));
  let D = math.sqrt (Math.pow (X, 2) + math.pow (Y, 2));

  // 일정 거리만큼 Center가 변경될 시에만 마스크 데이터를 불러옴
  if (D > 1.5) {
    mapCenterOld = mapCenter;
    getMaskDataAndDrawMarker (mapCenter.Ha, mapCenter.Ga);
  }

  getMaskDataAndDrawMarker ();
});

function keywordSearch (keyword) {
  ps.keywordSearch (keyword, keywordSearchCallback);
}

async function keywordSearchCallback (data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    let center = new kakao.maps.LatLng (data[0].y, data[0].x);
    map.setCenter (center);
    getMaskDataAndDrawMarker (data[0].y, data[0].x);
  }
}

async function getMaskDataAndDrawMarker (lat, lng) {
  document.querySelector ('.loader-wrapper').style.display = 'flex'; // 데이터를 가져올때 loading 띄우기
  const maskData = await getMaskData (lat, lng).then (storeData => {
    document.querySelector ('.loader-wrapper').style.display = 'none'; // 가져오면 없애기
    return storeData;
  });

  // 마커를 그리는 구문
  for (const data of maskData) {
    drawMarker (data);
  }
}

async function getMaskData (lat, lng) {
  let request_url = `${base_mask_url}lat=${lat}&lng=${lng}`;
  let response = await fetch (request_url);
  let result = await response.json ();
  console.log (result.stores);
  return result.stores;
}

// 지도에 마커를 표시하는 함수
function drawMarker (maskdata) {
  let image = {
    green: './green.png',
    yellow: './yellow.png',
    red: 'red.png',
    grey: 'grey.png',
  };

  let imageSize = new kakao.maps.Size (32, 32);
  let imageOption = {offset: new kakao.maps.Point (25, 15)};

  let imageSrc;
  if (maskData.remain_stat === 'plenty') {
    imageSrc = image.green;
  } else if (maskData.remain_stat === 'some') {
    imageSrc = image.yellow;
  } else if (maskData.remain_stat === 'few') {
    imageSrc = image.red;
  } else {
    imageSrc = image.grey;
  }

  // 마커 정보를 담은 마커 이미지 생성
  const markerImage = new kakao.maps.MarkerImage (
    imageSrc,
    imageSize,
    imageOption
  );

  // 마커를 생성하고 지도에 표시합니다
  var marker = new kakao.maps.Marker ({
    map: map,
    position: new kakao.maps.LatLng (maskData.lat, maskData.lng),
    image: markerImage,
    clickable: true,
  });

  let infoHTML = `<div class = "info-window><h3>이름 : ${maskData.name}</h3><p>입고시간 : ${maskData.stock_at}</p><p>업데이트 시간 : ${maskData.created_at}</p></div>`;
  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow ({
    content: infoHTML,
    removable: true,
  });

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener (marker, 'click', function () {
    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
    infowindow.setContent (
      '<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>'
    );
    infowindow.open (map, marker);
  });
}
