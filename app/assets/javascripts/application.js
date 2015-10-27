// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//

// External dependencies
//= require jquery
//= require jquery_ujs
//= require jsSHA
//= require jsdiff
//= require momentjs
//= require momentjs/locale/pt-br
//= require fluxxor
//= require react
//= require react_ujs
//= require datetimepicker
//= require autosize
//= require imperavi-redactor
//= require redactor/pt_br
//= require slick.js

// Application files
//= require components
//= require document_flux
//= require_tree .


var ready;
onJQueryReady = function() {
  $('.datetimepicker').datetimepicker({
    lang: 'pt-BR',
    format:'d/m/Y H:i',
    inline: true,
    minDate:'-1970/01/01',
    maxDate:'+1970/01/60'
  });

  $('#document_closes_for_contribution_at_button').click(function() {
    $('#document_closes_for_contribution_at').datetimepicker('show');
  });

  autosize($('.autosize'));
  $('.redactor').redactor({
    buttons: ['bold', 'italic', 'link'],
    lang: 'pt_br',
    minHeight: 300,
    pastePlainText: true
  });

  $('.slick').slick();
  $('.responsive-slick').slick({
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // Google Maps Autocomplete
  if(autocompleteElement = document.getElementById('city_autocomplete')) {
    autocomplete = new google.maps.places.Autocomplete(
      autocompleteElement, {
        types: ['(cities)'],
        componentRestrictions: { 'country': 'br' }
      }
    );

    google.maps.event.addListener(autocomplete, 'place_changed', function(){
      $("#document_city").val(autocomplete.getPlace().name);
      $("#document_state").val(autocomplete.getPlace().address_components[2].long_name);
    });
  }

  // Handle scope change on document form
  function onDocumentScopeChange(){
    switch ($("#document_scope").val()) {
      case "Municipal":
        $("#document_state").hide();
        $("#city_autocomplete").show();
        break;
      case "Estadual":
        $("#document_state").show();
        $("#city_autocomplete").hide();
        break;
      default:
        $("#document_state").hide();
        $("#city_autocomplete").hide();
    }
  }

  $("#document_scope").change(onDocumentScopeChange);
  onDocumentScopeChange();

  setTimeout(function(){
    $(".flash-message").slideUp()
  }, 5000);
};

$(document).ready(onJQueryReady);
$(document).on('page:load', onJQueryReady);
