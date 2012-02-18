$(function() {

  // TODO: mvc to keep url, selected example, search text, and result in sync

  function update_result(url, $result) {
    $.ajax({
      url: url,
      success: function(data) {
        $result.text(data);
        $result.removeClass('error');
      },
      error: function() {
        $result.text("Invalid url.");
        $result.addClass('error');
      }
    });
  }

  function update_query(url) {
    $('#search-text').val(url);
    update_result(url, $('#search-result'));
  }

  function update_history(hash) {
    if (window.history) {
      window.history.replaceState({}, null, '#' + hash);
    } else {
      window.location.hash = hash;
    }
  }

  // Load the examples using the api backend
  (function() {
    $('.example').each(function(index, element) {
      var $div = $(element).find('div');
      var href = $div.find('a').attr('href');
      update_result(href, $div.find('p'));
    });
  })();

  // Read any hash from the url set the sandbox input to use this value
  (function() {
    var hash = window.location.hash;
    if (hash) {
      hash = hash.substring(1, hash.length);
      update_query(hash);
    }
  })();

  var $prev_selected = undefined;
  $('#search-examples a').click(function(e) {
    e.stopPropagation();

    var $this = $(this);
    var hash = $this.attr('href');
    hash = hash.substring(1, hash.length);
    if ($prev_selected) {
      $prev_selected.removeClass('selected');
    }
    var $parent = $this.parent();
    $parent.addClass('selected');
    $('#search-text').val(hash);

    update_history(hash);
    update_query(hash);

    $prev_selected = $parent;
  });

  var $prev_selected = undefined;
  $('#search-text').keypress(function(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
      var $this = $(this);
      var hash = $this.val();
      update_history(hash);
      update_result(hash, $('#search-result'));
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
