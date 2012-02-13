$(document).ready(function() {
  $prev_selected = undefined;
  $('#search-examples a').click(function(evt) {
    evt.preventDefault();
    var $this = $(this);
    var link_path = $this.attr('href');
    if ($prev_selected) {
      $prev_selected.removeClass('selected');
    }
    $this.parent().addClass('selected');
    $('#search-text').val(link_path);
    $('#search-result').text('Random value: ' + new Date());
    $prev_selected = $this.parent();
  });
});

/*
$(document).ready(function() {
  $('#examples').carouFredSel({
    scroll: {
      items: 1,
      duration: 1000,
      pauseOnHover: true
    }
  });
});
*/
