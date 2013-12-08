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
			nbr_questions = $questions.length;

    	$ktest_container.find('.notice').hide();
    	$questions.hide();

    	$.each($questions, function(index, question) {
    		var $question = $(question)
    		$question.find('.statement').append(' ('+ parseInt(index+1) +'/'+ nbr_questions +')')
    		if (index < nbr_questions-1) {
    			$question.data('next-question', $questions[index+1]);
    		};
    	});

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
    	var $question_ul = $question.find('ul.answers'),
    		$answers = $question_ul.find('li'),
    		$all_questions = $question.closest('.ktest').find('.question');

    	$all_questions.hide();

    	$question.addClass('well');
    	$question_ul.hide();
    	$question.append('<form />');
    	var $question_form = $question.find('form');

    	$.each($answers, function(index, answer) {
    		var $answer = $(answer),
    			answer_content = $answer.html(),
    			answer_value = $answer.data('correct') === true ? true : false;

    		$question_form.append('<label><input data-correct="'+ answer_value +'" class="answer" type="checkbox" /> ' + answer_content + '</label>');
    	});

    	$question.append('<a data-action="ktest-validate-answer" href="#" class="btn btn-primary">'+ uc_first($.fn.ktest.labels.validate) +'</a>')

    	$question.show();
		$(document).scrollTop($question.offset().top);
    }

	/**
	 * Displays correction for a specific question.
	 * @param {jQuery} $question The question to show correction
	 * @param {function} callback A callback function to be fired when finished
	 * @private
	 * @author Pascal Lando
	 */
	var show_correction = function ($question, callback) {
		var $answers = $question.find('form').find('.answer'),
			$infos = $question.find('.infos'),
			$validation_btn = $question.find('a[data-action="ktest-validate-answer"]'),
			nbr_mistakes = 0;


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
			$question.append('<p class="alert alert-danger"> ' + uc_first($.fn.ktest.labels.you_made) + ' ' + nbr_mistakes + ' ' + $.fn.ktest.labels.mistake + (nbr_mistakes > 1 ? 's': '') +' !</p>');
		} else {
			$question.append('<p class="alert alert-success">'+ uc_first($.fn.ktest.labels.correct_answer) +' !</p>');
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
			rate_20 = result.nbr_correct_answers*20/result.nbr_questions,
			duration_minutes = result.test_duration/1000/60;

		$questions.hide();
		$ktest_container.append('<div class="well report">\
			<p>'+ uc_first($.fn.ktest.labels.test_is_finished) + ' ' + (duration_minutes>1.1 ? Math.round(duration_minutes) : $.fn.ktest.labels.less_than_a) + ' ' + $.fn.ktest.labels.minute + (duration_minutes>=2 ? 's' : '') + ' !</p>\
			<p>'+ uc_first($.fn.ktest.labels.you_correctly_answered) + ' ' + result.nbr_correct_answers + ' ' + $.fn.ktest.labels.question + ' ' + (result.nbr_correct_answers>1 ? 's' : '') + ' ' + $.fn.ktest.labels.on  + ' ' + result.nbr_questions +' ('+ $.fn.ktest.labels.something_like + ' <strong>' + rate_20 + '/20</strong> !).</p>\
		</div>');

		var $report = $ktest_container.find('.report');

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
    $.fn.ktest = function() {

    	var $ktest_container = $(this),
    		estimated_time = $ktest_container.data('time'),
    		difficulty = $ktest_container.data('difficulty'),
    		$questions = $ktest_container.find('.question'),
    		nbr_questions = $questions.length,
    		nbr_correct_answers = 0,
    		begin_time;

    	check_lang_pack();

    	$questions.hide();
    	$ktest_container.find('.infos').hide();
    	$ktest_container.append('<div class="well notice">\
    		<p>'+ uc_first($.fn.ktest.labels.nbr_questions) + ' : <strong>'+ nbr_questions +'</strong></p>\
    		<p>'+ uc_first($.fn.ktest.labels.difficulty) + ' : '+ (difficulty == 1 ? '<span class="label label-success">'+ uc_first($.fn.ktest.labels.simple) +'</span>' : difficulty == 2 ? '<span class="label label-warning">'+ uc_first($.fn.ktest.labels.medium) +'</span>' : difficulty == 3 ? '<span class="label label-danger">'+ uc_first($.fn.ktest.labels.hard) +'</span>' : '') + '</p>\
    		<p>'+ uc_first($.fn.ktest.labels.estimated_time) + ' : <strong>'+ estimated_time + ' ' + $.fn.ktest.labels.minute + (estimated_time > 1 ? 's' : '') + '</strong></p>\
    	</div>');
    	$ktest_container.append('<a data-action="ktest-start-test" href="#" class="btn btn-primary">'+ uc_first($.fn.ktest.labels.start_test) +'</a>');

	    $(document).on('click', '.ktest a[data-action="ktest-start-test"]', function () {
	    	$(this).hide();
	    	start_test($ktest_container);
	    	begin_time = new Date();
			return false;
		});

	    $(document).on('click', '.ktest a[data-action="ktest-validate-answer"]', function () {
	    	var $question = $(this).closest('.question');

			show_correction($question, function (nbr_mistakes) {
				if (nbr_mistakes == 0) {
					nbr_correct_answers++;
				};
			});

			return false;
		});

	    $(document).on('click', '.ktest a[data-action="ktest-continue-test"]', function () {
	    	var $question = $(this).closest('.question'),
	    		$next_question = $($question.data('next-question'));

	    	if ($next_question.length) {
		    	ask_question($next_question);
	    	} else {
	    		var data = {
	    			nbr_questions: nbr_questions,
	    			nbr_correct_answers: nbr_correct_answers,
	    			test_duration: new Date(new Date() - begin_time)
	    		}
	    		show_report($ktest_container, data);
	    	}
			return false;
		});

	    $(document).on('click', '.ktest a[data-action="ktest-show-all-answers"]', function () {
			show_all_answers($ktest_container);
			return false;
		});
    };
}( jQuery ));
