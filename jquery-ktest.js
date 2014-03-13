(function($) {
	"use strict";

	/**
	 * Uppercases the first letter of a string.
	 * @param {string} string The string to convert
	 * @private
	 * @author Pascal Lando
	 */
	var uc_first = function (string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}

	/**
	 * Checks if a translation dict has been initialized by the user.
	 * If not, loads a default values set.
	 * @private
	 * @author Pascal Lando
	 */
	var check_lang_pack = function () {
		var default_labels = {
				'start_test': "start test",
				'question': "question",
				'nbr_questions': "number of questions",
				'difficulty': "difficulty",
				'simple': "simple",
				'medium': "medium",
				'hard': "hard",
				'estimated_time': "estimated time",
				'minute': "minute",
				'validate': 'validate',
				'continue_next': 'continue',
				'correct_answer': "correct answer",
				'you_made': "you made",
				'mistake': "mistake",
				'test_is_finished' : "the test is finished, you did it in",
				'less_than_a': "less than a",
				'you_correctly_answered': "you correctly answered",
				'on': "on",
				'something_like': "something like",
				'review_all': "review all questions",

				'html_failed_comment' : "<p><strong>You failed this test.</strong></p><p>But don't worry, reading our advices should allow you to make visible progress.</p><p>Good luck !</p>",
				'html_can_do_better_comment' : "<p><strong>You are average on this test.</strong></p><p>Reading our advices should allow you to make visible progress.</p><p>Good luck !</p>",
				'html_good_job_comment' : "<p><strong>Goo job on this test!</strong></p><p>Feel free to try ou our other tests.</p>",
			}

		if (typeof $.fn.ktest.labels != 'undefined') {
			$.each($.fn.ktest.labels, function(index, label) {
				default_labels[index] = label;
			});
		}
		$.fn.ktest.labels = default_labels;
	}

	/**
	 * Initializes the test by updating questions with useful stuff, and
	 * launches first question.
	 * @private
	 * @author Pascal Lando
	 */
	var start_test = function ($ktest_container) {
		var $questions = $ktest_container.find('.question'),
			nbr_questions = $questions.length,
			begin_time = new Date();

    	$ktest_container.find('.notice').hide();
    	$questions.hide();

    	$.each($questions, function(index, question) {
    		var $question = $(question)
    		$question.data('index', parseInt(index+1));
    		if (index < nbr_questions-1) {
    			$question.data('next-question', $questions[index+1]);
    		};
    	});

    	$ktest_container.data('begin-time', begin_time);
		ask_question($($questions[0]));
	}

	/**
	 * Asks a question: hide other questions, convert <ul /> description to
	 * a <form /> element with inputs.
	 * @param {jQuery} $question The question to ask
	 * @private
	 * @author Pascal Lando
	 */
    var ask_question = function ($question) {
    	var $ktest_container = $question.closest('.ktest'),
    		$question_ul = $question.find('ul.answers'),
    		$answers = $question_ul.find('li'),
    		$all_questions = $question.closest('.ktest').find('.question'),
    		$question_form = $('<form />');

    	$all_questions.hide();
		$question.prepend('<div class="question-number">Question ' + $question.data('index') + '/' + $ktest_container.data('nbr-questions') + '</div>');
    	$question_ul.hide();
    	$question.append($question_form);
    	$question.addClass('well');

    	$.each($answers, function(index, answer) {
    		var $answer = $(answer),
    			answer_content = $answer.html(),
    			answer_value = $answer.data('correct') === true ? true : false;

    		$question_form.append('<div><label><input data-correct="'+ answer_value +'" class="answer" type="checkbox" /> ' + answer_content + '</label></div>');
    	});

    	$question.append('<a data-action="ktest-validate-answer" href="#" class="btn btn-primary">'+ uc_first($.fn.ktest.labels.validate) +'</a>')

    	$question.show();
		$(document).scrollTop($question.offset().top);
    }

	/**
	 * Displays correction for a specific question.
	 * @param {jQuery} $question The question to show correction
	 * @param {function} callback A callback function to be called at the end
	 * @private
	 * @author Pascal Lando
	 */
	var show_correction = function ($question, callback) {
		var $ktest_container = $question.closest('.ktest'),
			$answers = $question.find('form').find('.answer'),
			$infos = $question.find('.infos'),
			$validation_btn = $question.find('a[data-action="ktest-validate-answer"]'),
			nbr_mistakes = 0,
			nbr_correct_answers_before = $ktest_container.data('nbr-correct-answers');


		$.each($answers, function(index, answer) {
			var $answer = $(answer),
				answer_correct_value = $answer.data('correct');

			if ( ( $(answer).prop('checked') && answer_correct_value == true) ||
				 (!$(answer).prop('checked') && answer_correct_value == false)
			) {
				$answer.closest('label').addClass('text-success');
			}
			else {
				$answer.closest('label').addClass('text-danger');
				nbr_mistakes++;
			}
		});

		$validation_btn.hide();

		if (nbr_mistakes > 0) {
			$question.append('<p class="alert alert-danger">' + uc_first($.fn.ktest.labels.you_made) + ' ' + nbr_mistakes + ' ' + $.fn.ktest.labels.mistake + (nbr_mistakes > 1 ? 's': '') + ' !</p>');
		} else {
			$question.append('<p class="alert alert-success">' + uc_first($.fn.ktest.labels.correct_answer) + ' !</p>');
			$ktest_container.data('nbr-correct-answers', nbr_correct_answers_before+1);
		}

		if ($infos.length) {
	    	$question.append($infos);
	    	$infos.show();
	    	$(document).scrollTop($infos.offset().top);
		};

    	$question.append('<a data-action="ktest-continue-test" class="btn btn-primary" href="#">'+ uc_first($.fn.ktest.labels.continue_next) +'…</a>');

		if (typeof callback != 'undefined') {
			callback(nbr_mistakes);
		};
	}

	/**
	 * Displays a final report containing test results.
	 * @param {jQuery} $ktest_container The test main container
	 * @param {object} result An object (dict) containing results data
	 * @private
	 * @author Pascal Lando
	 */
	var show_report = function ($ktest_container, result) {
		var $questions = $ktest_container.find('.question'),
			rate_20 = Math.round(100*result.nbr_correct_answers*20/result.nbr_questions)/100,
			duration_minutes = result.test_duration/1000/60,
			$report = $('<div class="well report">\
				<p>'+ uc_first($.fn.ktest.labels.test_is_finished) + ' ' + (duration_minutes>1.1 ? Math.round(duration_minutes) : $.fn.ktest.labels.less_than_a) + ' ' + $.fn.ktest.labels.minute + (Math.round(duration_minutes)>=2 ? 's' : '') + '.</p>\
				<p>'+ uc_first($.fn.ktest.labels.you_correctly_answered) + ' ' + result.nbr_correct_answers + ' ' + $.fn.ktest.labels.question + (result.nbr_correct_answers>1 ? 's' : '') + ' ' + $.fn.ktest.labels.on  + ' ' + result.nbr_questions +' ('+ $.fn.ktest.labels.something_like + ' <strong>' + rate_20 + '/20</strong>).</p>\
			</div>');

		$questions.hide();

		if (rate_20 < 10) {
			$report.append('<div class="alert alert-danger">'+ $.fn.ktest.labels.html_failed_comment +'</div>')
		}
		else if (rate_20 >= 10 && rate_20 < 15) {
			$report.append('<div class="alert alert-warning">'+ $.fn.ktest.labels.html_can_do_better_comment +'</div>')
		}
		else {
			$report.append('<div class="alert alert-success">'+ $.fn.ktest.labels.html_good_job_comment +'</div>')
		}

		$report.append('<div>\
			<a data-action="ktest-show-all-answers" href="#" class="btn btn-default">'+ uc_first($.fn.ktest.labels.review_all) +'</a>\
		</div>');

		$ktest_container.append($report);
	}

	/**
	 * Show all answers.
	 * @param {jQuery} $ktest_container The test main container
	 * @private
	 * @author Pascal Lando
	 */
	var show_all_answers = function ($ktest_container) {
		var $questions = $ktest_container.find('.question');
		$.each($questions, function(index, question) {
			$(question).show();
			$(question).find('a').hide();
		});
		$ktest_container.find('.report').hide();
		$(document).scrollTop($ktest_container.offset().top);
	}

	/**
	 * The plugin main function.
	 * @author Pascal Lando
	 */
    $.fn.ktest = function(options) {

		var default_options = {
			push_ga_events : false
		}
		var settings = $.extend({}, default_options, options);

    	check_lang_pack();

		this.each(function() {
		   	var $ktest_container = $(this),
				difficulty = typeof $ktest_container.data('difficulty') != 'undefined' ? $ktest_container.data('difficulty') : null,
				estimated_time = typeof $ktest_container.data('time') != 'undefined' ? $ktest_container.data('time') : null,
				$questions = $ktest_container.find('.question'),
				nbr_questions = $questions.length,
				$notice = $('<div class="well notice"><p>'+ uc_first($.fn.ktest.labels.nbr_questions) + ' : <strong>'+ nbr_questions +'</strong></p></div>');

	    	$questions.hide();
	    	$ktest_container.addClass('ktest');
	    	$ktest_container.find('.infos').hide();
	    	$ktest_container.data('nbr-questions', nbr_questions);
	    	$ktest_container.data('nbr-correct-answers', 0);

	    	$ktest_container.append($notice);

	    	if (difficulty) {
	    		$notice.append('<p>'+ uc_first($.fn.ktest.labels.difficulty) + ' : '+ (difficulty == 1 ? '<span class="label label-success">'+ uc_first($.fn.ktest.labels.simple) +'</span>' : difficulty == 2 ? '<span class="label label-warning">'+ uc_first($.fn.ktest.labels.medium) +'</span>' : difficulty == 3 ? '<span class="label label-danger">'+ uc_first($.fn.ktest.labels.hard) +'</span>' : '') + '</p>');
	    	};

	    	if (estimated_time) {
	    		$notice.append('<p>'+ uc_first($.fn.ktest.labels.estimated_time) + ' : <strong>'+ estimated_time + ' ' + $.fn.ktest.labels.minute + (estimated_time > 1 ? 's' : '') + '</strong></p>');
	    	};

	    	$ktest_container.find('.description').prependTo($notice);
	    	$ktest_container.append('<a data-action="ktest-start-test" href="#" class="btn btn-primary">'+ uc_first($.fn.ktest.labels.start_test) +'</a>');


		    $ktest_container.on('click', 'a[data-action="ktest-start-test"]', function () {
				var $btn = $(this),
					$ktest_container = $(this).closest('.ktest');

		    	$btn.hide();
		    	start_test($ktest_container);
				return false;
			});

		    $ktest_container.on('click', 'a[data-action="ktest-validate-answer"]', function () {
				var $question = $(this).closest('.question');

				show_correction($question, function (nbr_mistakes) {
					if (settings.push_ga_events) {
						var question_text = $question.find('.statement').text();
						try {
							_gaq.push(['_trackEvent', 'jquery-ktest', question_text, nbr_mistakes.toString()]);
						}
						catch (err) {
							throw "Error when pushing Google Analytics event";
						}
					};
				});
				return false;
			});

		    $ktest_container.on('click', 'a[data-action="ktest-continue-test"]', function () {
		    	var $ktest_container = $(this).closest('.ktest'),
					$question = $(this).closest('.question'),
					$next_question = $($question.data('next-question'));

		    	if ($next_question.length) {
			    	ask_question($next_question);
		    	} else {
		    		var data = {
		    			nbr_questions: $ktest_container.data('nbr-questions'),
		    			nbr_correct_answers: $ktest_container.data('nbr-correct-answers'),
		    			test_duration: new Date(new Date() - $ktest_container.data('begin-time'))
		    		}
		    		show_report($ktest_container, data);
		    	}
				return false;
			});

		    $ktest_container.on('click', 'a[data-action="ktest-show-all-answers"]', function () {
		    	var $ktest_container = $(this).closest('.ktest');

				show_all_answers($ktest_container);
				return false;
			});

    	});

    };
}( jQuery ));
