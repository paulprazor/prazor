(function(){
	app.directive('audioPlayerbar', ['$sce', 'dataService', '$timeout', function ($sce, dataService, $timeout){
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/audioPlayerBar/view/audioPlayerBar.html',
			scope: {
				ngModel : '='
			},
			link: function(scope, element, attr){

				var timer;

				function setStation(details){
					scope.$parent.currentStation.station = details.station;
					scope.$parent.currentStation.stations = details.stations;					
					scope.$parent.currentStation.$index = (details.index >= 0) ? details.index : scope.$parent.currentStation.$index;

					

					scope.currentStation.genre = scope.$parent.currentStation.genre
					scope.currentStation.station = scope.$parent.currentStation.station;
					scope.currentStation.stations = scope.$parent.currentStation.stations;
					scope.currentStation.$index = scope.$parent.currentStation.$index;
					scope.hidePlayerBar = false;


					getStationDetails(scope.currentStation.station);
				}

				function getCurrentSongDetails(data){
					var song = data.song[0],
						currentDate = new Date(),
						currentGMT = currentDate.toGMTString();
					
					currentGMT = currentGMT.slice(4).replace('GMT', '');

					var	currentGMTTime = new Date(currentGMT),	
						currentSeconds = currentGMTTime.getTime(),

						songStart = new Date(song.programStartTS),
						songSeconds = songStart.getTime(),
						songDuration = (parseInt(song.duration) * 1000),

						timeout = ((songSeconds + songDuration) - currentSeconds);

						scope.$parent.currentStation.station.song = song;

						if(timeout > 0){
							$timeout.cancel(timer);
							timer = $timeout(function() {
			                    getStationDetails(scope.currentStation.station);
			                }, timeout);
						}
						else{
							$timeout.cancel(timer);
							timer = $timeout(function() {
			                    getStationDetails(scope.currentStation.station);
			                }, 5000);
						}

					nowPlayingiOS(song);
				}

				
				window.audioplayer.configure( successCallback, failureCallback);

				var successCallback = function(result) {
						console.log('audio callback ' + JSON.stringify(result));
					if (result.type==='progress') {
						console.log('progress/duration/available - ' + result.progress + '/' + result.duration + '/' + result.available); // available not currently supported  
					} else if (result.type==='state') {
						console.log('status - ' + result.state + '/' + result.description);
					} else if (result.type==='error') {
						console.log('error - ' + result.reason);
					} else if (result.type==='current') {
						console.log('current audio ' + JSON.stringify(result.audio));
					} else if (result.type==='next') {
						console.log('skip to next audio track'); // typically fired by remote control/lock screen controls  
					} else if (result.type==='previous') {
						console.log('skip to previous track'); // typically fired by remote/control/lock screen controls
					} else {
						console.log('AudioCallback unhandled type (' + result.type + ')');
					}
				};


				// updates the now playing native for iOS
				function nowPlayingiOS (song) {
					var artist = song.artist,
						title = song.title,
						album = song.album,
						cover = song.cover;


					//nowPlaying.updateMetas(artist,title,station);

					window.audioplayer.setaudioinfo( successCallback,
						failureCallback,
							// metadata used for iOS lock screen, Android 'Now Playing' notification  
							{
								"title": title,
								"artist": artist,
								"image": {
									"url": cover
								},
									"imageThumbnail": {
									"url": cover
								},
									"name": "Prazor",
									"description": ""
								}
							);
				}



				function getStationDetails(station){
					// Call to get Playlist details
					var config = {
						method : 'GET',
						url : 'https://streamdb6web.securenetsystems.net/player_status_update/' + station.station_id + '_history.txt'
					};
					
					dataService.getPlaylistDetails(config).then(
						function(response){
							getCurrentSongDetails(response.data.playHistory);
						},function(error){
							console.log(error);
						});
				}

				// Sets play btn property
				function setPlayPauseBtn(isPlaying){
					scope.playPauseBtn = (!isPlaying) ? 'play' : 'pause';
				}



				function playAudio (station){
					dataService
						.getM3U(station.station_id)
						.then(buildPlayer);
				}


				// builds the player
				function buildPlayer (response){
					var source = M3U.parse(response.data)
					
					source = source[0].file

					if(!scope.audio){
						scope.audio = document.createElement("audio");
					}					

					scope.audio.setAttribute('src', source); //change the source
					scope.audio.load(); //load the new source
					scope.audio.play(); //play

					scope.playing = true;
					setPlayPauseBtn(scope.playing);
				}



				function setStationDetails(index, currentStation){
					var details = {};
					details.station = currentStation.stations[index];
					details.index = (index);
					details.stations = currentStation.stations;
					setStation(details);					
				}

				function stopAudio(){
					scope.audio.pause();
					scope.playing = false;
					setPlayPauseBtn(scope.playing);
					scope.hidePlayerBar = true;
				}
				
				scope.currentStation = {};
				scope.hidePlayerBar = true;

				// Watches Index to change station
				scope.$watch('$parent.currentStation.$index', function (index, oldIndex) {
					if (index !== oldIndex && scope.$parent.currentStation.stations) {
						var details = {};
						details.station = scope.$parent.currentStation.stations[index];
						details.index = index;
						details.stations = scope.$parent.currentStation.stations;

						details.index = index;
						setStation(details);
					};
				});

				scope.playing = true;
				setPlayPauseBtn(scope.playing);
				
				scope.previous = function(currentStation){
					var index = (currentStation.$index - 1);
					if(index >= 0){
						setStationDetails(index,currentStation);
					}
				};
				scope.next = function(currentStation){
					var index = (currentStation.$index + 1);
					if(index < currentStation.stations.length){
						setStationDetails(index,currentStation);
					}				
				};

				scope.playPause = function(){
					if(scope.playing){
						scope.audio.pause();
					}
					else{
						scope.audio.play();
					}

					scope.playing = !scope.playing;
					setPlayPauseBtn(scope.playing);			
				};

				scope.$watch('$parent.currentStation.station.station_id', function(model, oldModel){	
					if(model && model !== oldModel){				
						playAudio(scope.$parent.currentStation.station);
						scope.hidePlayerBar = false;
					}			
				});

				scope.$on('stoppingAudio', function(model, oldModel){
					if(scope.audio){
						stopAudio();
					}						
				});
			}
		}
	}]);
})();	