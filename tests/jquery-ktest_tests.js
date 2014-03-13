module("Initialization");

test("Global init via $('.test').ktest();", function() {
	$('.test').ktest();
	$.each($('.test'), function(index, ktest) {
		ok($(ktest).find('div.notice').length, "Notice div is present, the test has been initialized.");
	});
});

test("Global init via $('#my_test').ktest();", function() {
	$('#my_test').ktest();
	ok($('#my_test').find('div.notice').length, "Notice div is present, the test has been initialized.");
});


