---
title: Proposal for Creating Free Online Peer-Reviewed Journals
date: 2015-10-28 20:46 UTC
tags:
published: true
---

In a discussion on Facebook recently, the lack of rhetoric and composition journals was highlighted as a serious professional problem.[^1] Our field has grown extensively in the last 20 years but the number of publishing venues has not similarly expanded to keep pace with the growing needs of scholars who have research to publish. The recent swath of major and important edited collections was also highlighted as a product of this issue: fewer journals means a need for more venues. As I mentioned, however, edited collections have serious problems when it comes time for tenure and promotion, when we have to interface the tics and worries of our specific field with the broader culture of the humanities and the university as a whole. These broader cultures often discount edited collections because the table of contents are the product of friendships rather than merit.[^3]

All of this is to say that I have been thinking about ways to address this lack of journals in rhetoric. As we have seen in recent years, some of the best new journals in our field and in the humanities in general have been open-access, web-only publications. These journals are doing innovative work and, more importantly, are starting to be recognized as legitimate venues for serious thought, which is great. I was wondering, however, **if part of the barrier to creating more online journals is technical: shaped by barriers associated with the costs and other vagaries of webhosting.[^4] And, as such, I'm proposing here an idea I had for running and hosting an online journal using completely free software *and* completely free hosting.**[^2]

What set my mind going was reading a bunch of articles from [*Parrhesia*](http://parrhesiajournal.org/), an online journal doing really cool work in critical philosophy. Specifically, each issue is distributed as a webpage but the articles themselves are individual PDF files that have page numbers (that are sequential across the issue), thus making the journal "look" like a regular print journal. Additionally, I noticed (because I notice these things) that they are using LaTeX to produce these PDFs (*EDIT: As [Jonathan Goodwin](https://twitter.com/joncgoodwin/status/659763643811274752) pointed out, they may not be using TeX, but,nonetheless, it still got my gears turning*), which strikes me as a really easy way to manage publication workflow. Additionally, by distributing essays as PDFs (which can also be produced in Markdown and built using [Pandoc](http://pandoc.org/)), the actual journal website can be a static site, made in something like Middleman or Jekyll. Moreover, both those apps deploy to [GitHub Pages](http://github.io), which is free.

This got me thinking about how it might be possible to manage the entire publication workflow (submissions, reader reports, copyediting, and publication online) using totally free apps. Specifically, I'm proposing that using [GitHub Pages](https://pages.github.com/), [Google Sheets](https://www.google.com/sheets/about/), [Google Drive](https://www.google.com/drive/), [Google App Scripts](https://www.google.com/script/start/), and [Todoist](https://todoist.com/), I think it is possible to host an entire journal in the cloud. Below, I'm going to discuss how I would use each tool to accomplish this, by discussing the tasks involved.

### Google Sheets

*I'm basically envisioning Google Sheets functioning as a stand-in for a relational database.*

* Track Article Metadata
	* Author Name(s)
	* Title
	* Status
	* Day Submitted
	* Day Status Last Changed
	* Unique ID
* Track Readers
	* Name
	* Email
	* Institutional Affiliation
	* Unique ID
* Track Reader Reports
	* Map Reader ID to Article ID
	* Day Assigned


### Google Drive

* Submission Storage
* Reader Report Storage
* Distribute Documents to Reviewers

### Google App Scripts

*If you haven't messed around with App Scripts (and I hadn't even heard of it), it's a tool for hosting snippets of JavaScript on Google Drive and have them function like web apps. So, basically, they glue a lot of these processes together.*

* [Handle Submission Upload](http://ctrlq.org/code/19747-google-forms-upload-files)
* [Handle Reader Report Upload](http://ctrlq.org/code/19747-google-forms-upload-files)
* Collect Author / Submission Data (can also be done with Google Forms)
* [Convert Accepted Documents Into Markdown (for production)](https://github.com/mangini/gdocs2md)

### GitHub Pages

* Host Static Journal Site (PDF & HTML)
	* [Middleman](https://middlemanapp.com/)
	* [Jekyll](http://jekyllrb.com/)
* Store Backbone + [GoogleAPI](https://github.com/hrovira/Backbone.GoogleAPIs) Scripts
	* For any other Admin Stuff (not handled above)

### Todoist

*I considered using Google Tasks for this, but you can't ([easily](http://techawakening.org/how-to-create-shared-google-task-list/2411/)) share task lists with others, as you can with Todoist.*

*Also, Todoist can be fairly easily integrated because of its [API](https://developer.todoist.com/).*

* Track who's doing what.
* Share status of reports, articles, etc.

## Possible Issues

I've only thought about this insofar as I drew a diagram of the above on a piece of scrap paper (and then spilled water all over it, which is I why I didn't attach it), but I see a couple of issues emerging from this plan:

1. *I'm not super-clear about what the backend of most journals look like*---As described here, I see journals primarily accepting submissions, farming them out to reviewers, and then publishing (or not) these. I imagine that there are other features a system like this might need, but I'm not sure. **I would really appreciate thoughts on this, in the comments**.
1. *Reliance on Google Apps*---Given the number of products Google has abruptly shutdown (RIP Google Reader), I worry about relying too heavily on their products, though Sheets and Drive seem crucial to their brand (and I think a lot of the Google App Scripts stuff could be handled through Backbone JS).
1. *Authentication*---I'm not sure how to, for instance, map a reader report submission to a specific user, without relying on an external datastore. I *think* you could use Google accounts to specifically share submissions through Drive and, similarly, share unique URLs for report uploading, but I'm not sure about this. *Also, I worry requiring Google accounts to submit might be a problem to certain people*.
1. *Offline Processes*---Converting submissions to PDF and HTML will involve, as I envision it now, running [Pandoc](http://pandoc.org/) on a computer not in the cloud, but this could all be synced through a GitHub group account.
1. *Conversion Work*---To use some of the really cool citation features, citations would have to be manually converted into a format Pandoc can read or imported into Zotero. You could *require* submission in Markdown / bibliography format, but that strikes me as something people in the humanities are unlikely to do. Alternately, you could not use the citeproc features in Pandoc, which probably makes more sense (but stinks because they're so cool).

## Conclusion

I think there is a real prospect for hosting and managing a journal using totally free software. It would involve some development work (especially for the App Scripts), and I worry that it may not be as "out of the box" as some of the packages that require relational databases and paid hosting, but it seems like this is a real possibility.

Also, to clarify, I'm not doing this right now because I'm busy with a lot of other things. If you want to make this happen, please feel free to use anything here or ask any questions. Also, I'd appreciate any comments people have on this proposal, as I'd like to see what things this leaves out or what things might need improving.

[^1]: I'm not giving credit here because I think Facebook is a private space; suffice to say this problem was not something I mentioned.
[^3]: I say, fully realizing that this distinction is *bullshit*.
[^4]: Not to mention a host of other issues including time, reputation, and the other forms of (often uncompensated) work involved in such endeavors. What can I say? I like thinking about software solutions.
[^2]: I'm proposing this because I don't have time to work on this right now.