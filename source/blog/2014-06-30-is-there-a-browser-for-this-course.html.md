---
title: Is There a Browser For This Course?
date: 2014-06-30 17:58 UTC
tags: pedagogy, edutech, teaching
---

I've been struggling with a technology problem in my teaching, lately. Unfortunately, this issue is about as unsexy as they come. Besides getting students working on creating online editions in Markdown or mapping the American novel, I'm finding it to be an increasingly large problem that my students are still using Internet Explorer 8. So, what I'm wondering is can and should we assign a browser in addition to required textbooks?

<a href="/images/blog/chrome.jpg"><img src="/images/blog/chrome.jpg" alt="Google Chrome Logo" /></a>

All of this started when I began using my [standardized template for course syllabuses](http://andrew.pilsch.com/courses/) during my 2nd semester at ASU. I received an email from a student that was cryptic, as student emails about technology problems so often are. She was in an online class and simply said that she couldn't see any of the syllabus sections mentioned in my overview podcast. After *several* emails, it turned out that she was *still* using Internet Explorer 8, a browser that even Microsoft stopped supporting in April of this year.

The issue of IE8's persistence has been a major problem in the web development industry. It was a big deal when [jQuery](http://www.jquery.com) dropped support for the browser with their 2.x branch of the library. Same when [Zurb Foundation](http://foundation.zurb.com/) announced the browser would never be support. The Allwebcafe Blog has [an excellent overview](http://www.allwebcafe.com/blog/time-to-drop-support-for-ie8/) of the case for and against supporting the browser. As you can see in the graph below (originally included in their post), IE 8 is dropping:

<a href="/images/blog/ie-versions-graph.jpg"><img src="/images/blog/ie-versions-graph.jpg" class="splash" alt="Google Chrome Logo (Source Allebcafe Blog)" /></a>

However, as the post also makes clear, because of a lack of automatic updating in that version (IE 9 started the inclusion of an updater app to remind users to level up to the newest browser), the portion of IE8 users is not dropping as fast as the drop-off of, say, IE9 or 10. Additionally, as they mention, the browser is still used extensively in China, with significant communities in North America and Europe, as well.

This lingering illness presents problems for building modern websites. IE8 is missing a ton of features, including CSS3 and, most importantly, responsive media queries that render a paired down site for mobile browsers.

To return to my student, what was happening was that the syllabus's navigation was using [the mobile navigation menu](http://tinynav.viljamis.com/) and some of the CSS and JS to render the mobile site was not compatible in IE8. She actually couldn't see the site's menu and had no idea that the other pages existed. Ugh. It took four sets of email exchanges to sort this out, too, as, being an online student, I couldn't see what the problem was.

Recently, I've been struggling with how to fix this problem. I've been reworking my syllabus template to be more IE friendly, but as I was struggling with it yesterday, [Shawna](http://www.shawnaross.com) mentioned a better solution: **why not just require students to have an updated browser**?

Why not, indeed?

We require our students to buy or rent textbooks for our classes. In the past, I've required students to subscribe to [Netflix](http://www.netflix.com) in a class on apocalyptic TV and film. Further, applications require specific browsers all the time. I even have a statement reminding my online students that a working computer is a basic requirement for completing the class. Many of us implicitly require MS Word when requiring files to be turned in as .docx files.

Additionally, I'm starting to work through how to word this requirement. I'm thinking about a new version of my course syllabus that won't render unless the student has a non-IE8 version of the browser and links to instructions on installing something better. At the same time, what should that "something better" be? Chrome? Firefox? IE11? What if the student, for economic reasons, is still running a Windows XP laptop, despite that OS being out of support from Microsoft? I [can't (or won't)](http://cdn.memegenerator.net/instances/400x/32557890.jpg) very well talk them through installing Linux.

I think this might be a thornier issue than it appears, but at the same time many instructors don't give a second thought to assigning a $200 text book in their classes (I agonize over it, for the record; I try to get my students to have to buy as few books as possible). Is this an issue because it's an issue or because of my own aversion to layering requirements onto my students.

I'd be interested to hear if any of you have thoughts on this. Is there a reason not to do this?

