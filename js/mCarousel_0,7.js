/*
 * mCarousel version 0,6
 * http://www.digi-dil.com/mCarousel
 *
 * Copyright 2011, Armaan Ahluwalia
 * License Undecided
 */


(function( $ ){
  $.fn.mCarousel = function(options) {

	/* First Tier Variables */	
	
	var next_btn = (options.next) ? '.'+ options.next : "#mCarousel_next";
	var prev_btn = (options.prev) ? '.'+ options.prev : "#mCarousel_prev";	
	var crnt_item = 0;
	var items = [];
	var carouselHeight = options.height;
	var focusItem_width = options.featuredItem_width;
	var captionWidth = (options.captionWidth) ? options.captionWidth : 300;
	var captionHeight = (options.captionHeight) ? options.captionHeight :300;
			
	if(!options.next && !options.prev) { // Add buttons(and wrapper) if they are not specified
		$(this).wrap('<div id="mCarousel_outer" style="width:'+options.width+'px;height:'+options.height+'px;" />');
		$('#mCarousel_outer').append('<a href="#" id="mCarousel_next"></a><a href="#" id="mCarousel_prev"></a>');
		var prevBtnHeight = $(prev_btn).height();
		var nextBtnHeight = $(next_btn).height();
		$('#mCarousel_next').css('top',((options.height/2) - (nextBtnHeight/2))+'px');
		$('#mCarousel_prev').css('top',((options.height/2) - (prevBtnHeight/2))+'px');		
	} 
	$(this).attr('id','mCarousel_inner');  // Setup container class
	$(this).css({width:options.width+'px', height : options.height + 'px'});	//Setting container dimensions
	$("a" , this).each(function(index) { // Setting up items
		$(this).addClass('mCarousel_item');
		var item_id = "mCI"+index;
		$(this).attr('id',item_id);
		items[index] = "#mCI"+index;
	})	
	var prevBtnWidth = $(prev_btn).width();	
	var nextBtnWidth = $(next_btn).width();		
	var carouselWidth = options.width -  nextBtnWidth - prevBtnWidth;
	var carOdd = ((items.length % 2) != 0 ) ? true : false;	// Whether or not the number of items is Odd
	var corner = 2 * Math.ceil((items.length - 5) / 6);	// The turning point in the carousel between front and back
	var midIndex = corner / 2;	// Non rounded index 
	var midItem_width = focusItem_width / 2;
	var diffWidth = focusItem_width - midItem_width;	
	var behindCorners = items.length - 1  - corner;
	var behindCornersRatio = behindCorners/items.length;
	var theMagicNumber = 1 + behindCornersRatio * (1-behindCornersRatio);
	var the_perc_pow = 100;
	var backMidIndex = (carOdd) ?  corner + (behindCorners / 2) + 0.5 : Math.ceil(corner + (behindCorners / 2));
	var numBackPairs = Math.ceil(behindCorners / 2);
	var backItem_width	= midItem_width / Math.pow(1.8, numBackPairs-1);
	var backDiffWidth = midItem_width - backItem_width;	
	var halfCarousel = carouselWidth/2;
	var halfHeight = carouselHeight/2;
	var indexItemLength = items.length - 1;
	var the_press_fac = 8;
	var props = new Array();

	console.log("\n focus_width : ",focusItem_width, "\n midIndex: ", midIndex, "\n backMidIndex: ", backMidIndex, "corner : ",corner, " behind corners", behindCorners , "is car odd", carOdd , "items length", items.length, "behindCorners Ratio is ", behindCornersRatio , " magic number is", theMagicNumber);
	
	calculateValues();
	
	function navCarousel(direction) { // Moving the current item number up and down and then calling the actual shiftCarousel function accordingly
		if(direction == "next")  {
			var temp_item = items[indexItemLength];
			items.pop();
			items.unshift(temp_item);
		}
		if(direction == "prev")  {
			var temp_item = items[0];
			items.shift();
			items.push(temp_item);
		}
		shiftCarousel();
	} 
	
	function calculateValues() {
		$(items).each(function(index){
			var the_item_id = items[index];	
			var the_height_init = $(the_item_id).height();
			var the_width_init = $(the_item_id).width();
			var the_ratio = the_width_init  / the_height_init;
			var i;
			props[the_item_id] = new Array();
			console.log('________for item ',index,'___________')
			for(i=0;i <= items.length ; i++) {
				if(i <= corner) {
					if (i == midIndex) {
						var the_width = (focusItem_width/the_ratio > (3 * halfHeight)) ? (3 * halfHeight / 2) * the_ratio : focusItem_width;
						var pos = prevBtnWidth + (halfCarousel) - (the_width/2);
						var posTop = (options.height) - (the_width/the_ratio);
						var the_zIndex = Math.round(backMidIndex) - corner + Math.round(midIndex) + 1;

					} else {
						var the_perc = (i - midIndex)/(midIndex);
						var the_perc_abs = Math.abs(the_perc);
						var the_perc_press = the_perc_abs + ((0.5 - the_perc_abs)/the_press_fac); // Thank you Tasha : ) 
						var the_perc_exp = the_perc_abs - ((0.5 - the_perc_abs)*(0.5 - Math.abs(0.5 - the_perc_abs))/the_press_fac);	 // Thank you Tasha : ) 
						var the_perc_sign = the_perc/the_perc_abs;					
						var the_width = (1 -  ((corner/(items.length)) * the_perc_abs)) * focusItem_width;
							the_width = (the_width/the_ratio > halfHeight) ? halfHeight * the_ratio : the_width;
						var pos = (the_perc_sign > 0) ? (halfCarousel + prevBtnWidth) + (focusItem_width/2) + (the_perc_exp * (halfCarousel - (focusItem_width/2))) - (the_width) : (halfCarousel + prevBtnWidth) - ((focusItem_width/2) + (the_perc_exp * (halfCarousel - (focusItem_width/2))));
						var posTop = ((options.height) - (the_perc_press * (halfHeight)) - ((the_width/the_ratio)/2))/ theMagicNumber;
						var the_zIndex = Math.round(backMidIndex) - corner + Math.round(midIndex) - Math.abs(midIndex - i) + 1;
					}
				} else {
					if(i == backMidIndex) {
						var the_width = backItem_width;
						var pos = (halfCarousel + prevBtnWidth) - (the_width/2);
						var posTop = 0;
						var the_zIndex = 1;			
					}
					else {
						var the_perc = (i - backMidIndex)/(corner + 1 - backMidIndex);
						var the_perc_abs = Math.abs(the_perc);					
						var the_perc_exp = the_perc_abs - ((0.5 - the_perc_abs)*(0.5 - Math.abs(0.5 - the_perc_abs))/the_press_fac);	 // Thank you Tasha : ) 						
						var the_perc_press = the_perc_abs + ((0.5 - the_perc_abs)/the_press_fac); // Thank you Tasha : ) 						
						var the_perc_sign = the_perc/the_perc_abs;					
						var the_width = (the_perc_press * midItem_width);
							the_width = (the_width/the_ratio > halfHeight) ? (halfHeight * the_ratio) : the_width;	
						var pos = (the_perc_sign > 0) ? (halfCarousel + prevBtnWidth) + ((the_perc_exp * (halfCarousel * (2 - theMagicNumber))) - the_width) : (halfCarousel + prevBtnWidth) - (the_perc_exp * (halfCarousel * (2 - theMagicNumber)));
						var posTop = (halfHeight) * (the_perc_press) - (the_width/the_ratio); // There is a problem here – We don't know the height of the items at perc 1. Problem appears when outlier items occur
						var the_zIndex = Math.abs(Math.round(backMidIndex) - i) + 1;
					}
				}
			if(index == i) {
				console.log("half carousel is ", halfCarousel, "the_perc_abs is ",the_perc_abs, "the width is ",the_width, "prev btn width is ", prevBtnWidth, " pos is ", pos);
				// console.log("the perc abs is ", the_perc_abs, "the_perc_press is ",the_perc_press, "postop is", posTop);
				// console.log( "the_perc_exp is", the_perc_exp,"half carousel is ",halfCarousel," prevBtnwidth is ",prevBtnWidth, " focusItem width /2 is ",focusItem_width/2,"rest of it is ", (the_perc_exp * (halfCarousel - (focusItem_width/2))) - (the_width))
				// console.log("the perc is: ",the_perc_abs," and the perc_press is: ",the_perc_press, "halfHeight is ",halfHeight, "height is ", (the_width/the_ratio), "half of its height is ",((the_width/the_ratio)/2), "the_perc_exp is", the_perc_exp);
				// console.log("index : ",i, "item_id : ",the_item_id," the width : ",the_width," position : ", pos, "the_perc",the_perc,"the_perc_pow : ",the_perc_pow , "the_perc_sq",the_perc_sq , "posTop is : ", posTop , "the z-index:" , the_zIndex);								
			}
			props[the_item_id][i] = {the_zIndex : the_zIndex, pos : pos, posTop : posTop , width : the_width};			
											
			}
		});
		shiftCarousel(); // Initially setup the carousel
	}
	
	function shiftCarousel() {		
		$(items).each(function(index){		
			
			var the_item_id = items[index];	
			$(the_item_id).css('z-index',props[the_item_id][index].the_zIndex);
			// console.log(props[the_item_id]);
			$(the_item_id).animate({
			    left: props[the_item_id][index].pos,
				top : props[the_item_id][index].posTop,
				width: props[the_item_id][index].width			
			  }, options.animTime, function() {
			});
		});
	}
	
	function setCaptions(what){
		var who = $(what);		
		var caption = (who.attr("title")) ? '<div class="mCarousel_caption">' + who.attr("title") + '</div>' : undefined;		
		
		if(caption) {		
			var h = who.height();
			var w = who.width();

			if(h > captionHeight) {
				var b = (h - captionHeight)/2;
				var l = (w - captionWidth)/2;
				var thisCapWidth = captionWidth;
				var thisCapHeight = captionHeight;
			}
			else {
				var b = 0;
				var l = 0;
				var thisCapWidth = w;
				var thisCapHeight = h;								
			}
	
			$("img",who).wrap('<div class="mCarosel_caption_wrapper" />');
			$(".mCarosel_caption_wrapper", who).append(caption);
  			$('.mCarousel_caption', who).css({'margin-left':l,'margin-bottom':b , 'width' : thisCapWidth , 'height' : thisCapHeight });

			// console.log("height : ",  h, "width : ",  w , "bottom :" , b ,"left : ", l , "thisCapWidth", thisCapWidth , "thisCapHeight", thisCapHeight);

			// Adding hovers to the captions
			$(who).hover(function(){
				$(who).find('.mCarousel_caption').animate({opacity:1, 'height':thisCapHeight},{queue:false,duration:300});
			}, function(){
				$(who).find('.mCarousel_caption').animate({opacity:0, 'height':'0'},{queue:false,duration:300});
			});			
		}
	}
	
	/* Adding Event Listeners to Buttons */
	$(next_btn).click(function () {
		navCarousel("next");
	})
	$(prev_btn).click(function () {
		navCarousel("prev");
	})	
	
  };
})( jQuery );