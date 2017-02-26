(function() {
  "use strict";

  const memoryGameModule = function() {
    let newArr = [];
    var startTimestamp = null;
    let startSI = null;

    class MemoryGame {
      constructor(tiles) {
        this.deck = tiles;
        this.shuffledDeck = this.shuffleCards(this.deck);
        this.build();
      }

      build() {
        const source = $('#tiles').html();
        const template = Handlebars.compile(source);
        const context = {
          southPark: this.shuffledDeck
        };
        const html = template(context);
        $('.grid').prepend(html);
      }

      shuffleCards(cards) {
        let fullDeck = cards.concat(cards); //doubles the length of the array
        let shuffledCards = fullDeck.sort(function(a, b) {
          return 0.5 - Math.random();
        });
        return shuffledCards;
      }
    }

    function bindEvents() {
      $('.start').on('click', function() {
        clearInterval(startSI);
        startTimer(0);
        clearScreen();
        getData();
        $('embed').removeClass('is-hidden');
      });

      $('.grid').on('click', '.tile', '.selected', function() {
        if ($('.selected').length < 2) {
          $(this).addClass('selected').removeClass('tile').children('.card').toggleClass('is-hidden');
          let dataName = $(this).attr('data-name');
          newArr.push(dataName);
          if (newArr.length == 2) {
            checkPair();
          }
        }
      });
    }

    function checkPair() {

      if (newArr[0] === newArr[1]) {
        $('.selected').each(function() {
          $(this).addClass('paired').removeClass('selected');
        });
        newArr = [];
        youWin();
      } else {
        newArr = [];
        setTimeout(flipOver, 1000);
      }
    }

    function flipOver() {
      $('.selected').addClass('tile').removeClass('selected').children('.card').toggleClass('is-hidden');
    }

    function youWin() {
      if ($('.tile').length === 0) {
        $('.win-screen').removeClass('is-hidden');
        $('.win-screen').on('click', '.re-start', function() {
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
      startSI = setInterval(function() {
        startTimestamp++;
        $('#timer').html(moment.unix(startTimestamp).format('mm:ss'));
      }, 1000);
    }

    function init() {
      bindEvents();
    }

    function getData() {
      const http = new XMLHttpRequest();
      http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
          const data = JSON.parse(http.response);
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
  const memoryApp = memoryGameModule();
  memoryApp.init();
})();
