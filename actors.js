// if ( $("#landing").hasClass('active')){
//     $('canvas').show();
//   } else {
//     $('canvas').fadeOut();
//   }
$( document ).ready(function() {
    $('.projecttext').hide();

});
// function infopage(){
//   $('.sectiontext').siblings('div').children('img').addClass("filtereffect");
//   $('.sectiontext').fadeOut();
//   $('.projecttext').fadeIn();
//   $('body').addClass("mobhide")
// }
//
// function closeinfopage(){
//   $('.sectiontext').siblings('div').children('img').removeClass("filtereffect");
//   $('.sectiontext').fadeIn();
//     $('.projecttext').fadeOut();
//     $('body').removeClass("mobhide")
// }

// function printid(){
// 	console.log($(this));
// 	console.log($(this).attr('id'));
// }



const projectSlugs = [
  'human-figure-diffused',
  'dgtl-dome',
  'click',
  'stablebodied',
  'hide',
  'the-metaverse',
  'luwten-draft-fall-tour',
  'lena-hessels-club-tour',
  'throwing-bricks-48h-live',
  'dear-computer',
  'maarten-vos-at-lgw',
  'freaky-dancing',
  'tussen-hier-en-nu',
  'loie2'
];

const stories = $('.story');
let activeProject = null;
let landingScrollY = window.scrollY;

stories.each(function (index) {
  const slug = projectSlugs[index];
  if (!slug) return;

  $(this).attr('data-project-slug', slug)
    .find('.project_link')
    .attr('href', `/${slug}`);
});

function projectFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts.length === 1 ? decodeURIComponent(parts[0]).toLowerCase() : null;
}

function showProject(slug, pushHistory = true, savedScrollY = window.scrollY) {
  const story = stories.filter(`[data-project-slug="${slug}"]`);
  if (!story.length) return false;

  if (pushHistory) {
    landingScrollY = window.scrollY;
    window.history.replaceState({ landingScrollY }, '', window.location.href);
    window.history.pushState({ project: slug, landingScrollY }, '', `/${slug}`);
  } else {
    landingScrollY = savedScrollY || 0;
  }

  activeProject = slug;
  stories.removeClass('open');
  stories.not(story).hide();
  $('#mainphotos').addClass('project-open');
  stories.find('.zoom').hide();
  stories.find('.entry').stop(true, true).fadeOut(0);
  story.addClass('open');
  story.find('.zoom').css('display', 'flex').hide().fadeIn(0);
  $(canvas).stop(true, true).fadeOut(0);
  $('.role').html('<a onclick="returnToLanding()">close</a>');
  // Start at the document top and keep the story's intentional blank margin.
  const scrollStoryPageToTop = () => window.scrollTo(0, 0);
  scrollStoryPageToTop();
  requestAnimationFrame(scrollStoryPageToTop);
  return true;
}

function closeProject(savedScrollY = landingScrollY) {
  activeProject = null;
  $('.zoom').stop(true, true).fadeOut(0);
  $('.open').removeClass('open');
  stories.show();
  $('#mainphotos').removeClass('project-open');
  $('#mainphotos').fadeIn(0);
  $('.entry').fadeIn(0);
  $(canvas).fadeIn(0);
  $('.role').html('<a onclick="about()">about</a>');
  window.scrollTo(0, savedScrollY || 0);
}

function returnToLanding() {
  if (window.history.state && window.history.state.project) {
    window.history.back();
  } else {
    window.history.replaceState({ landingScrollY: 0 }, '', '/');
    closeProject(0);
  }
}

$('.project_link').click(function (event) {
  event.preventDefault();
  showProject($(this).closest('.story').attr('data-project-slug'));
});

window.addEventListener('popstate', function (event) {
  const slug = projectFromPath();
  if (slug && showProject(slug, false, event.state && event.state.landingScrollY)) return;
  closeProject(event.state && event.state.landingScrollY);
});

$(function () {
  const initialSlug = projectFromPath();
  if (initialSlug && showProject(initialSlug, false, 0)) {
    window.history.replaceState({ project: initialSlug, landingScrollY: 0 }, '', window.location.href);
  }
});



function about(){
  $('#canvas').fadeOut();
  $('#mainphotos').fadeOut().promise().done(function(){
  $('#about')
    .css("display", "flex")
    .hide()
		// .scrollTop()
    .fadeIn()
		.scrollTop();
	});

  $('.role').html('<a onclick="closeabout()">close</a>');
}

function closeabout(){
	if (activeProject) {
		returnToLanding();
		return;
	}
	$('.zoom').fadeOut().promise().done(function(){
  $('#canvas').fadeIn();
  $('#mainphotos').fadeIn();
  $('.entry').fadeIn();
});

	$('.open').removeClass('open');

  $('#about').fadeOut();
  $('.role').html('<a onclick="about()">about</a>');
	$(canvas).fadeIn();


}

function home(){
	if (activeProject) {
		returnToLanding();
		return;
	}
	$('#about').fadeOut();
	$('.zoom').fadeOut().promise().done(function(){
  $('#mainphotos').fadeIn();
	console.log('goodfade');
});
$('#mainphotos').fadeIn();
$(canvas).fadeIn();

}
