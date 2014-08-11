---
layout: false
---
xml.instruct! :xml, :version => '1.0'
xml.feed "xmlns" => "http://www.w3.org/2005/Atom" do
	xml.title "Andrew Pilsch Blog"
	xml.id "#{config[:site_deploy_root]}/blog/"
	xml.link "href" => "#{config[:site_deploy_root]}/blog/"
	xml.link "href" => "#{config[:site_deploy_root]}/blog/ifttt.xml", "rel" => "self"
	xml.updated blog.articles.first.date.to_time.iso8601
	xml.author { xml.name "Andrew Pilsch" }
	#xml.language('en-us')

	blog.articles[0..5].each do |article|
		xml.entry do
			xml.title article.title.gsub(/[_*]/,"")
			xml.link "rel" => "alternate", "href" => "#{config[:site_deploy_root]}" + article.url
			xml.id "#{config[:site_deploy_root]}" + article.url
			xml.published article.date.to_time.iso8601
			xml.updated article.date.to_time.iso8601
			xml.author { xml.name "Andrew Pilsch" }
			xml.content ((if article.data.has_key? "description" then Haml::Filters::Markdown.render(article.data["description"]+ link_to( "[...]", "#{config[:site_deploy_root]}#{article.url}")) else article.summary + link_to( "[...]", "#{config[:site_deploy_root]}#{article.url}") end)), "type" => "html"
		end
	end
end