'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var memoryGameModule = function memoryGameModule() {
    var newArr = [];
    var startTimestamp = null;
    var startSI = null;

    var MemoryGame = function () {
      function MemoryGame(tiles) {
        _classCallCheck(this, MemoryGame);

        this.deck = tiles;
        this.shuffledDeck = this.shuffleCards(this.deck);
        this.build();
      }

      _createClass(MemoryGame, [{
        key: 'build',
        value: function build() {
          var source = $('#tiles').html();
          var template = Handlebars.compile(source);
          var context = {
            southPark: this.shuffledDeck
          };
          var html = template(context);
          $('.grid').prepend(html);
        }
      }, {
        key: 'shuffleCards',
        value: function shuffleCards(cards) {
          var fullDeck = cards.concat(cards); //doubles the length of the array
          var shuffledCards = fullDeck.sort(function (a, b) {
            return 0.5 - Math.random();
          });
          return shuffledCards;
        }
      }]);

      return MemoryGame;
    }();

    function bindEvents() {
      $('.start').on('click', function () {
        clearInterval(startSI);
        startTimer(0);
        clearScreen();
        getData();
      });

      $('.grid').on('click', '.tile', function () {
        $(this).children('.card').toggleClass('is-hidden');
        var dataName = $(this).attr('data-name');
        newArr.push(dataName);
        console.log($(this));
        if (newArr.length === 2) {
          checkPair(dataName);
        }
      });
    }

    function checkPair(shit) {
      console.log(newArr);
      if (newArr[0] === newArr[1]) {
        $('.tile[data-name=' + shit + ']').addClass('paired').removeClass('tile');
        newArr = [];
        youWin();
      } else {
        newArr = [];
      }
    }

    function youWin() {
      if ($('.tile').length === 0) {
        $('.win-screen').removeClass('is-hidden');
        $('.win-screen').on('click', '.re-start', function () {
          clearScreen();
        });
      }
    }

    function clearScreen() {
      $('.grid').html('');
      $('.win-screen').addClass('is-hidden');
    }

    function startTimer(myStartTimestamp) {
      startTimestamp = parseInt(myStartTimestamp);
      startSI = setInterval(function () {
        startTimestamp++;
        $('#timer').html(moment.unix(startTimestamp).format('mm:ss'));
      }, 1000);
    }

    function init() {
      bindEvents();
    }

    function getData() {
      var http = new XMLHttpRequest();
      http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
          var data = JSON.parse(http.response);
          new MemoryGame(data);
        }
      };
      http.open('GET', './data/southpark.json', true);
      http.send();
    }
    return {
      getData: getData,
      init: init
    };
  };
  var memoryApp = memoryGameModule();
  memoryApp.init();
})();