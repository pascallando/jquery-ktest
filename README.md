jquery-ktest
============

jquery-ktest is **a simple yet customizable client-side knowledge tests maker** based on jQuery. It allows jQuery users to quickly pusblish knowledge tests (quiz, questionnaire) for end-users.

Requirements
------------

* jQuery 1.2.3+

How to use
----------

1. Download jquery-ktest and make it accessible in your assets directory.

2. Include jQuery and jquery-ktest in your page (preferably at the end, just before `</body>`):

	```html
	<script src="jquery.js"></script>
	<script src="jquery-ktest.js"></script>
	```

3. jquery-ktest default language is **English**. If needed, you can also include a language pack in order to get your content translated:

	```html
	<script src="jquery-ktest/lang/fr.js"></script>
	```

4. Create your first knowledge test. jquery-ktest tests declaration are just simple HTML content: `.ktest` div containing `.question` divs.

	```html
	<div class="ktest">
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
	```

5. Ktestify your content:

	```javascript
	$(function () {
		$('.ktest').ktest();
	});
	```

Settings
--------
A few optional settings are available.

###Content customization

####Test difficulty

The test difficulty is a [1..3] number. It will be displayed on the test welcome screen. Just add a `data-difficulty` attribute to your ktest div:

```html
<div class="ktest" data-difficulty="2">
	...
</div>
```

####Test estimated time

The test estimated time is an integer number, representing a time in minutes. It will be displayed on the test welcome screen. Just add a `data-time` attribute to your ktest div:

```html
<div class="ktest" data-time="10">
	...
</div>
```

####Test description

The test description is displayed on top of the test welcome block. Just add a `.description` div in your ktest declaration:

```html
<div class="ktest">
	<div class="description">
		<p>This test will allow you to check your guitaristic knowledge!</p>
	</div>
	...
</div>
```

####Question hints

For each question defined in a test, you can specify a hint text, which will be shown after the user validated his answer. Just add a `.info` div to your question definition:

```html
<div class="question">
	...
	<div class="infos">
		<p>Here are some explanation on this subject...</p>
	</div>
</div>
```

###Plugin options

Options can be passed to the plugin using a dictionnary:

```javascript
$('.ktest').ktest({
	option_1: 'value',
	option_2: 'other value',
	...
});
```

The available options are listed in the table bellow:

| Option        | Type           | Default value  | Function |
| ------------- |----------------|----------------|----------|
| `push_ga_events` | boolean | false | When set to true, jquery-ktest will push an event to Google Analytics each time a user validates an answer. Of course, GA should be paramed on your page, so that the `_gaq` object is available. Generated code for the event: `_gaq.push(['_trackEvent', 'jquery-ktest', <QUESTION>, <NUMBER OF MISTAKES THE USER DID>])` |

