---
title: Easily Create Elegant Course Websites w/ YAML & Middleman
date: 2015-03-04 18:44 UTC
tags: middleman, yaml, markdown, teaching, courseware
---

I love creating new classes. I love the process of mapping a course of knowledge, thinking about what texts will best guide students along a path toward a new understanding of the world. I love the process of creating assignments to help them test their new skills and create new knowledge artifacts to help better understand what they are learning. I love all of that.

However, I *hate* creating syllabuses. Ever since I began teaching at the college level, the process of mapping the readings I plan to assign to specific calendar dates has been tedious. I have been looking for a way to provide a set of class meetings (readings, due dates, etc.) and end up with each class meeting matched to a calendar date. Such a software package would allow class schedules to become reasonably portable from semester to semester, as the list of activities becomes untethered from specific calendar dates.

Using Ruby and YAML, I have found a way to make this possible. The course website creator I've built, called [middleman-course-template](https://github.com/oncomouse/middleman-course-template), has just been released on GitHub, and I am really excited to share this exciting and easy way to manage syllabuses with you.

I have experimented with numerous ways of doing this in the past. At Penn State, I used to export my reading schedule as an iCal file and embed it on the course website using Google Calendar. Students hated that (they find it hard to interact with) *and* I hated it, because it was brittle and hard to change.

For the last few years, I've been using a custom package of HTML renders and cobbled together Ruby libraries to build [the course sites you can see at my course repository](http://andrew.pilsch.com/courses). It worked okay, but it was still weirdly brittle and would randomly break for no reason.

With this in mind, I decided to rewrite my course template to use open source, well-documented technologies to simply, quickly, and easily generate course schedules. Specifically, I figured out how to use a basic [YAML](http://yaml.org) file to render course schedules. I think this approach is the easiest way to create course webpages, and I think you will too. Let's take a look at the data structure I use:

~~~ yaml
start: 2015-01-13
end: 2015-04-30
holidays:
  - date: 2015-03-10
    name: Spring Break
  - date: 2015-03-12
    name: Spring Break
meets:
  - tuesday
  - thursday
weeks:
  1: 'Introduction'
classes:
  - |
    * Course Overview
  - |
    * First Full Day of Instructions
    * Read pg. 1-15 in *They Say, I Say*
~~~

To use this structure, you set the day on which the class begins and ends, as well as the dates and names of any holidays during the semester (I'm thinking about writing a scraper to pull this off the ASU academic calendar). You enter the days of the week your class meets, and then you just have to create an array of class meetings, with each meeting being written in Markdown and rendered by my syllabus manager.

Then it's just a matter of using an [eRuby](https://en.wikipedia.org/wiki/ERuby) [template to render the schedule](https://github.com/oncomouse/middleman-course-template/blob/master/source/schedule.html.erb) (along with a little magic from [Chronic](https://github.com/mojombo/chronic), which is the coolest thing since sliced bread)

And that's it: you go from one simple data structure in a standard markup language to a responsive, online syllabus complete with links, due dates, and holidays.

This syllabus generator is part of a larger course template, [middleman-course-template](https://github.com/oncomouse/middleman-course-template), that uses [Middleman](https://middlemanapp.com/) (my favorite [static site generator](https://staticsitegenerators.net/)) to handle page creation, building, and deployment. The CSS is based on [Bootstrap's](http://getbootstrap.com/) grid system and responsive navigation component (the site displays on mobile phones as well as desktops). You can view a sample of the kind of course website this template creates at [http://andrew.pilsch.com/courses/sample-course/](http://andrew.pilsch.com/courses/sample-course/).

Check out the whole project repository on [GitHub](https://github.com/oncomouse/middleman-course-template). It's really, really easy to create elegant, online course syllabuses.