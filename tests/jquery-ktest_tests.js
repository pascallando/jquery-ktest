module("Initialization");
test("Global init via $('.ktest').ktest();", function() {
	$('.ktest').ktest();
	$.each($('.ktest'), function(index, ktest) {
		ok($(ktest).find('div.notice').length, "Notice div is present, the test has been initialized.");
	});
});

