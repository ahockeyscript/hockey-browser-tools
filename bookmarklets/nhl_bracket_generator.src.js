javascript:(function($) {

  if ($('#my-playoffs-bracket').length == 0) {

    $('body').append('<div id="my-playoffs-bracket" class="modal" tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title">Playoffs Bracket</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div> </div> </div> </div>');

    $('#my-playoffs-bracket .modal-body').empty().append('<section id="playoffs-bracket-view"><div class="bracket-container">  <div class="bracket-box western division-upper matchup-upper round-1"></div> <div class="bracket-box western division-upper matchup-lower round-1"></div> <div class="bracket-box western division-lower matchup-upper round-1"></div> <div class="bracket-box western division-lower matchup-lower round-1"></div> <div class="bracket-box eastern division-upper matchup-upper round-1"></div> <div class="bracket-box eastern division-upper matchup-lower round-1"></div> <div class="bracket-box eastern division-lower matchup-upper round-1"></div> <div class="bracket-box eastern division-lower matchup-lower round-1"></div>  <div class="bracket-box western division-upper round-2"></div> <div class="bracket-box western division-lower round-2"></div> <div class="bracket-box eastern division-upper round-2"></div> <div class="bracket-box eastern division-lower round-2"></div>  <div class="bracket-box western round-3"></div> <div class="bracket-box eastern round-3"></div>  <div class="bracket-box western round-4"></div> <div class="bracket-box eastern round-4"></div>  <div class="bracket-slot eastern atlantic round-1 rank-1" id="series-a-top"></div> <div class="bracket-slot eastern atlantic round-1 rank-wc" id="series-a-bottom"></div> <div class="bracket-slot eastern atlantic round-1 rank-2" id="series-b-top"></div> <div class="bracket-slot eastern atlantic round-1 rank-3" id="series-b-bottom"></div> <div class="bracket-slot eastern metropolitan round-1 rank-1" id="series-c-top"></div> <div class="bracket-slot eastern metropolitan round-1 rank-wc" id="series-c-bottom"></div> <div class="bracket-slot eastern metropolitan round-1 rank-2" id="series-d-top"></div> <div class="bracket-slot eastern metropolitan round-1 rank-3" id="series-d-bottom"></div> <div class="bracket-slot western central round-1 rank-1" id="series-e-top"></div> <div class="bracket-slot western central round-1 rank-wc" id="series-e-bottom"></div> <div class="bracket-slot western central round-1 rank-2" id="series-f-top"></div> <div class="bracket-slot western central round-1 rank-3" id="series-f-bottom"></div> <div class="bracket-slot western pacific round-1 rank-1" id="series-g-top"></div> <div class="bracket-slot western pacific round-1 rank-wc" id="series-g-bottom"></div> <div class="bracket-slot western pacific round-1 rank-2" id="series-h-top"></div> <div class="bracket-slot western pacific round-1 rank-3" id="series-h-bottom"></div>  <div class="bracket-slot eastern atlantic round-2 team-upper" id="series-i-top"></div> <div class="bracket-slot eastern atlantic round-2 team-lower" id="series-i-bottom"></div> <div class="bracket-slot eastern metropolitan round-2 team-upper" id="series-j-top"></div> <div class="bracket-slot eastern metropolitan round-2 team-lower" id="series-j-bottom"></div> <div class="bracket-slot western central round-2 team-upper" id="series-k-top"></div> <div class="bracket-slot western central round-2 team-lower" id="series-k-bottom"></div> <div class="bracket-slot western pacific round-2 team-upper" id="series-l-top"></div> <div class="bracket-slot western pacific round-2 team-lower" id="series-l-bottom"></div>  <div class="bracket-slot eastern atlantic round-3" id="series-m-top"></div> <div class="bracket-slot eastern metropolitan round-3" id="series-m-bottom"></div> <div class="bracket-slot western central round-3" id="series-n-top"></div> <div class="bracket-slot western pacific round-3" id="series-n-bottom"></div>  <div class="bracket-slot western round-4" id="series-o-western"></div> <div class="bracket-slot eastern round-4" id="series-o-eastern"></div>  <div class="bracket-slot round-4-winner hidden" id="series-o-winner"></div> </section>');

    $('head').append('<link rel="stylesheet" type="text/css" href="https://www-league.nhlstatic.com/nhl.com/sections/playoffs/builds/18079747dcd6e99ef6f83019d6311e8b9b54edcc_1517869619/styles/index.css.gz" />');
    $('head').append('<style type="text/css">#my-playoffs-bracket .bracket-slot-content { cursor: pointer; }</style>');

  }

  $.get('https://statsapi.web.nhl.com/api/v1/standings/wildCardWithLeaders?expand=standings.record,standings.team,standings.division,standings.conference,team.schedule.next,team.schedule.previous&season=20172018', function(data) {

    var brackets = {
      'Eastern': {},
      'Western': {}
    };
    var i;
    for (i = 2; i < 6; i++) {
      var conference, bracket;
      bracket = new Object();
      bracket.home = data.records[i].teamRecords[0];
      conference = (data.records[i].conference.name == 'Eastern') ? 0 : 1;
      if (bracket.home.conferenceRank == 1) {
        bracket.away = data.records[conference].teamRecords[1];
      } else {
        bracket.away = data.records[conference].teamRecords[0];
      }
      brackets[data.records[i].conference.name][data.records[i].division.name] = [bracket];

      brackets[data.records[i].conference.name][data.records[i].division.name].push({
        home: data.records[i].teamRecords[1],
        away: data.records[i].teamRecords[2]
      });
    }

    $section = $('#playoffs-bracket-view');
    $.each(brackets, function(conferenceName, conference) {
      $.each(conference, function(divisionName, division) {
        var seriesLabel = 'a';
        var upper = true;
        $.each(division, function(index, bracket) {
          var bracketType = (upper) ? 'upper' : 'lower';
          $.each(bracket, function(key, value) {
            var rank = (bracket[key].wildCardRank > 0) ? 'wc' : bracket[key].divisionRank;
            var $bracketSlot = $section.find('.bracket-slot.round-1.' + conferenceName.toLowerCase() + '.' + divisionName.toLowerCase() + '.rank-' + rank);
            var $bracketSlotContent = $('<div class="bracket-slot-content logo-round-team">');
            $bracketSlotContent.addClass('logo-bg--team-' + bracket[key].team.id + ' primary-bg--team-' + bracket[key].team.id);
            $bracketSlotContent.data({
              'conference': conferenceName.toLowerCase(),
              'division': divisionName.toLowerCase(),
              'bracket': bracketType
            });
            $bracketSlotContent.click(function() {
              var $round2Content = $(this).clone(true).off();
              $('.bracket-slot.round-2.' + $(this).data('conference') + '.' + $(this).data('division') + '.team-' + $(this).data('bracket'), $section).empty().append($round2Content);
              $round2Content.click(function() {
                var $round3Content = $($(this).clone(true).off());
                $('.bracket-slot.round-3.' + $(this).data('conference') + '.' + $(this).data('division'), $section).empty().append($round3Content);
                $round3Content.click(function() {
                  $('.bracket-slot.round-4.' + $(this).data('conference'), $section).empty().append(this.outerHTML);
                });
              });
            });
            $bracketSlot.append($bracketSlotContent);

          });

          upper = !upper;

        });
      });

    });

  });

  $('#my-playoffs-bracket').modal();

})(jQuery);