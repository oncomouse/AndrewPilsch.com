---
title: From Zer0 to Blog in 24 Hours
short_title: From Zer0 to Blog
date: 2013-08-17 17:52 UTC
tags:
---

I've been recently thinking about blogging again, especially as a means to work through, or at least note, ideas that may not be necessarily fully fleshed out into journal articles or conference presentations at the present moment. As [Shawna](http://shawnaross.com) likes to note, though, my workflow is generally one in which I work more than is necessary in order to save time in the future. This "going broke saving money" approach to time management is why I wrote my dissertation in LaTeX and why I generally do all my site development in [Middleman](http://middlemanapp.com), [HAML](http://haml.info/), and [SASS](http://sass-lang.com/). These technologies have a steep learning curve but make the actual work of computer-using significantly easier. I'm convinced that, over time, these long-term time savings will even out.

This approach to time management, of course, collided with my desire to start blogging again. Part of my problem with blogs, generally, is that the work of setting one up and maintaining it presents a barrier I'm not willing to course. For instance, I _hate_ dealing with Wordpress's increasingly bloated interface and I _really_ hate dealing with its bizarre template system (there's a reason you can sell Wordpress templates). As such, I wanted a blog that required very low entrance costs to writing an article _and_ to designing content.

Enter [Middleman](http://middlemanapp.com).

Middleman refers to itself as "a static site generator using all the shortcuts and tools in modern web development." In other words, it's the lazy-man's approach to making web pages (at least "lazy" in terms of the massive upfront costs I discussed above). Initially, I got into Middleman because it could take a stack of HAML and SASS files and compile them into a coherent, standards-compliant web page (with all the CSS3 and HTML5 goodness I could want). Used as a blogging platform, the advantage is tremendous. I already do all of my writing in [TextMate](http://macromates.com/), anyway, so Middleman is great: all I have to do is edit a text file in my favorite editor and run two commands in a terminal to have a new aritlce posted. This kind of blogging doesn't disrupt my workflow, it doesn't force me to "compose" my blog articles in a WYSIWYG editor, and it doesn't require any kind of database (which always struck me as overkill). That said, getting this blog set up was a bit of a process, but, at the same time, I literally started with nothing about 24 hours ago and have put this whole site together in that time.

In any case, for the remainder of this article, I want to detail all the tools and tutorials that went into my 24 hour blog creation party.

## Basic Tools

The other big tools in this process, besides Middleman, are HAML, SASS:

* [HAML](http://haml.info/) is an HTML pre-processor that allows you to avoid writing so many `<` and `>` in your code. It uses indentation instead to control tag nesting. Also, HAML lets you easily include [Ruby](http://www.ruby-lang.org/en/) code in your documents.
* [SASS](http://sass-lang.com/) is a CSS pre-processor (it stands for Syntactically Aware StyleSheets) that allows you to write CSS quickly and in much more ordered fashion. By including functions and variables into basic CSS, you can streamline website development.

## SASS Tools

There are a lot of projects that extend SASS. Here are some that I used in coding this blog:

* [Bourbon SASS](http://bourbon.io) is a collection of SASS mixins that add support for the weird vendor prefixed CSS3 tags, as well as a bunch of other useful features (such as `golden-ratio()`{:.language-ruby} and `@import clearfix`{:.language-sass}).
* [This Vimeo Video](http://vimeo.com/15168461) talks about how to manage color palettes using SASS partials. It is totally the best way to manage any design project in Middleman
    * I also use this partials method to manage fonts and things like column size.
	* _By using SASS partials to store your design constants, you can easily redesign your whole page_. For instance, right before launching, I decided to switch the body font from "[Cabin](http://www.google.com/fonts/specimen/Cabin)" to "[IM Fell Great Primer](http://www.google.com/fonts/specimen/IM+Fell+Great+Primer)." I literally had to switch to lines in my `_fonts.sass` file.
* Another easy way into color management with SASS is [SASS Color Palettes](https://github.com/FearMediocrity/sass-color-palettes/), which I found to be super-useful. It provides a range of pre-defined color variables you can use in your projects. I'm hosting the [samples page here](https://dl.dropboxusercontent.com/u/28696035/samples.html). This site is styled with `$mai-tai`{:.language-sass} as the base color.
* Once you have your base color, you can use [this list of SASS color functions](http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html) ([with some reading on basic color theory](http://www.colormatters.com/color-and-design/basic-color-theory)) to create a coordinated color palette quickly and easily. I'm making heavy use of `adjust-hue()`{:.language-ruby} to generate my two compliment colors.

## Responsive Design

[Responsive design](https://en.wikipedia.org/wiki/Responsive_web_design) seems to be the key web design concept of our moment ([Mashable says 2013 is the year of responsive design](http://mashable.com/2012/12/11/responsive-web-design/)). There are a lot of tools out there to facilitate such designs. Here's what I use:

* [The Goldilocks Approach](http://goldilocksapproach.com/) is my favorite responsive design template. It's very simple and it focuses your attention on designing mobile-first sites, with additive content. At the same time, though, it's super-easy to use and very clear. Also, it's usage of `ems` adapts well to SASS.
	* In fact, it adapts to SASS so well that I created [The Goldilocks Approach SASS](https://github.com/oncomouse/goldilocks-approach-sass) to manage this site.
* In addition to having a basic responsive framework for CSS, most websites use some kind of responsive [grid system](https://en.wikipedia.org/wiki/Grid_(graphic_design)) to produce mathematically pleasing designs.
	* [Bourbon Neat](http://neat.bourbon.io) is my favorite responsive grid framework, but there are many of them. [Susy](http://susy.oddbird.net/) seems to be the favorite amongst SASS users, but I like Neat's integration with Bourbon and that it is slightly easier to use.
	* Whichever grid framework you choose, though, you want to use one based in SASS and not a CSS grid framework, as CSS frameworks force you to clutter your HTML with a bunch of class names (like `.omega` and `.row-span-6`) that merely hook up the grid. With SASS, you can include predefined mixins within your existing stylesheet to set up your grid. No additional CSS required.

## Blogging With Middleman

While Middleman's blogging extension makes the work of posting and editing a blog very easy, the initial set-up is not as simple as the documentation would have you believe. Here are some links and tools that helped me get started:

* [Building a Middleman Blog](http://designbyjoel.com/blog/2012-10-20-building-a-blog-in-middleman/) is a useful overview of getting started blogging with Middleman (though even this article didn't answer some of my questions).
* [My config.rb Blog Configuration](https://gist.github.com/oncomouse/6238377) shows some tips for getting blogging working in Middleman. It's not as easy or as straight-forward as the documentation would have you believe.
	* One thing especially to note, `activate :directory_indexes`{: .language-ruby} has to be after the blog configuration or the directory indexes won't work and the blog will throw a bunch of weird errors.
* [Building Search Into Middleman](http://designbyjoel.com/blog/2012-11-23-middleman-search/) is a great article talking about how to use [jQuery](http://jquery.com) along with [JSON](http://www.json.org/) to build search into Middleman blog (which, given that the site is static, would be otherwise kind of difficult). I had to bang on this code for a while to get it work here, but it's a useful start.
* [Middleman Deploy](https://github.com/tvaughan/middleman-deploy) is one of the most useful tools you can have in your arsenal. As long as you can upload to your webhost via SSH or deploy to [GitHub Pages](http://pages.github.com/), it's one command between your code and publishing.

## Wrapping Up

All these tools are great and really streamline my design approach. I tend to take an ad-hoc approach to my tool stack, hence why I don't use an all-in-one responsive framework such as [ZURB Foundation](http://foundation.zurb.com/) or [Bootstrap](http://getbootstrap.com/2.3.2/). While those tools are great for building websites, my whole reason for this project was to get out of having to spend time fighting against the limitations of a specific package (in the original case Wordpress and it's very limiting interface but also in the case of an all-in-one framework such as Bootstrap). By taking an ad-hoc approach to my site building, I find that I can use the tools I like that solve the problems I have in a way that makes sense to me. 

Selfe and Selfe's classic essay ["The Politics of the Interface"](http://www.jstor.org/stable/358761) opened the field of writing and technology to the idea that software interfaces (usually GUI products) manifest political ideologies in the same way that border-crossings manifest the political ideologies of nation-states. While not necessarily interested in their critique of power, race, and gender, I think there's something even beyond GUI interfaces that Selfe and Selfe get at: monolithic software packages forces a specific tuning of coding practice. By using a more ad hoc approach inline with Eric S. Raymond's [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) of "one tool one task," I find myself spending more time focusing on fighting with my ideas and less time waiting at software's borders.

Anyway, the source for this whole project---both my blog and [my main personal page](http://andrew.pilsch.com)---is available on [GitHub](https://github.com/oncomouse/AndrewPilsch.com).
