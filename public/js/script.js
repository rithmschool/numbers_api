$(document).ready(function() {
  $('#search-examples a').click(function(evt) {
    evt.preventDefault();
    var link_path = $(this).attr('href');
    console.log('link_path', link_path);
    $('#search-text').val(link_path);
    $('#search-result').text('Random value: ' + new Date());
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
