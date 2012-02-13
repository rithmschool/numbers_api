$(function() {

  // TODO: mvc to keep url, selected example, search text, and result in sync

  function update_result(url) {
    $.ajax({
      url: url,
      success: function(data) {
        var $result = $('#search-result');
        $result.text(data);
        $result.removeClass('error');
      },
      error: function() {
        var $result = $('#search-result');
        $result.text("Invalid url.");
        $result.addClass('error');
      }
    });
  }

  function update_query(url) {
    $('#search-text').val(url);
    update_result(url);
  }

  (function() {
    var hash = window.location.hash;
    if (hash) {
      hash = hash.substring(1, hash.length);
      console.log('hash: ', hash);
      update_query(hash);
    }
  })();

  var $prev_selected = undefined;
  $('#search-examples a').click(function(e) {
    var $this = $(this);
    var url = $this.attr('href');
    url = url.substring(1, url.length);
    if ($prev_selected) {
      $prev_selected.removeClass('selected');
    }
    var $parent = $this.parent();
    $parent.addClass('selected');
    $('#search-text').val(url);
    update_query(url);

    $prev_selected = $parent;
  });

  var $prev_selected = undefined;
  $('#search-text').keypress(function(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
      var $this = $(this);
      var url = $this.val();
      window.location.hash = url;
      update_result(url);
    }
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
