============
jquery-ktest
============

jquery-ktest is **a simple yet customizable client-side knowledge tests maker** based on jQuery. It allows jQuery users to quickly pusblish knowledge tests (quiz, questionnaire) for end-users.

Requirements
============

* jQuery 1.2.3+

How to use
==========

1. Download jquery-ktest and make it accessible in your assets directory.

2. Include jQuery and jquery-ktest in your page (preferably at the end, just before `</body>`):

		<script src="jquery.js"></script>
		<script src="jquery-ktest.js"></script>

3. jquery-ktest default language is **English**. If needed, you can also include a language pack in order to get your content translated:

		<script src="jquery-ktest/lang/fr.js"></script>

4. Create your first knowledge test. jquery-ktest tests declaration are just simple HTML content. Your test div must have `.ktest` class.
	
		<div class="ktest" data-difficulty="3" data-time="5">
		    <div class="question">
		        <div class="statement">What notes a G major chord is made of?</div>
		        <ul class="answers">
		            <li>A B C</li>
		            <li data-correct="true">G B D</li>
		            <li>F E A</li>
		        </ul>
		    </div>
		
		    <div class="question">
		        <div class="statement">Who is or has been a guitar player part of the Rolling Stones band?</div>
		        <ul class="answers">
		            <li data-correct="true">Mick Taylor</li>
		            <li>Django Reinhardt</li>
		            <li data-correct="true">Keith Richards</li>
		            <li>Charlie Watts</li>
		            <li>Mike Mills</li>
		        </ul>
		    </div>
		</div>

5. Ktestify your content:

		$(function () {
			$('.ktest').ktest();
		});

Settings
========
A few optional settings are available.

Test description
----------------
The test description is displayed on top of the test welcome block. Just add a `.description` div in your ktest declaration:

		<div class="ktest" data-difficulty="1" data-time="10">
			<div class="description">
				<p>This test will allow you to check your guitaristic knowledge!</p>
			</div>
			...
		</div>
