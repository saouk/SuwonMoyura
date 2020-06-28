import {Controller} from "stimulus"

export default class extends Controller{
    static get targets() {
        return [ "map" ]
    }

    connect() {
        //var markers = [];
        this.loadMyLocation()

        //- view에 카카오 지도를 뿌림
        var Cheight = $(window).height();
        $('#map-size').css({'height':Cheight+'px'}); //-> Y좌표 full화면을 못구하겠어서 제이쿼리를 통해 화면에맞는 높이 사이즈를 구하도록함


        var options = {
            center: new kakao.maps.LatLng(37.2788, 126.953),
            level: 3
        };

        var map = new kakao.maps.Map(this.mapTarget, options)


        //- 화면 이동시 해당 화면의 좌표값을 받아옵니다.
        kakao.maps.event.addListener(map, 'dragend', function() {

            var latlng = map.getCenter();
            var x = latlng.getLat()
            var y = latlng.getLng()

            //- 1. ajax를 이용하여 x,y축 좌표값을 보낸다.
            //- 2. rails에서 위치값을 계산 한 후 response값으로 리턴
            $.ajax({
                url : `sites/search_sites?lat=${x}&lng=${y}`,
                type : "GET",
                dataType: "json",
                success: function(args) {
                    console.log(args)
                    var parseSite  = args.data

                    //- 받아온 데이터를 for문을 이용하여 마커를 추가해준다
                    parseSite.forEach(function (k) {
                        var markerPosition  = new kakao.maps.LatLng(k["lat"], k["lng"]);
                        var marker = new kakao.maps.Marker({
                            position: markerPosition
                        });
                        marker.setMap(map);
                        //markers.push(marker)
                    })
                },
                error : function(xhr, status, error){
                    //요청에 실패하면 에러코드 출력
                    alert("에러코드 : " + xhr.status);
                }
            });
        });
    }

    //- geolocation을 이용하여 나의 위치를 받아온다
    loadMyLocation(){
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude + ' ' + position.coords.longitude);
        }, function(error) {
            console.error(error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: Infinity
        });
    }
}