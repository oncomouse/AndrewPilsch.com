---
layout: false
---
xml.instruct! :xml, :version => '1.0'
xml.feed "xmlns" => "http://www.w3.org/2005/Atom" do
	xml.title "Andrew Pilsch Blog"
	xml.id "http://andrew.pilsch.com/blog/"
	xml.link "href" => "http://andrew.pilsch.com/blog/"
	xml.link "href" => "http://andrew.pilsch.com/blog/feed.xml", "rel" => "self"
	xml.updated blog.articles.first.date.to_time.iso8601
	xml.author { xml.name "Andrew Pilsch" }
	#xml.language('en-us')

	blog.articles[0..5].each do |article|
		xml.entry do
			xml.title article.title
			xml.link "rel" => "alternate", "href" => "http://andrew.pilsch.com" + article.url
			xml.id "http://andrew.pilsch.com" + article.url
			xml.published article.date.to_time.iso8601
			xml.updated article.date.to_time.iso8601
			xml.author { xml.name "Andrew Pilsch" }
			xml.summary (if article.data.has_key? "description" then article.data["description"] else article.summary end), "type" => "html"
			xml.content article.body, "type" => "html"
		end
	end
end