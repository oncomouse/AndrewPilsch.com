require 'open-uri'
require 'json'
module Jekyll
  class BlogTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
			if true#ENV["JEKYLL_ENV"] == "production"
				output = ""
				tmpl = File.read(File.join(Dir.pwd, "_includes", "box.html"))
				JSON.parse(URI.parse("http://andrew.pilsch.com/blog/frontpage.json").read).each do |article|
					article["short_description"] = Kramdown::Document.new(article["summary"]).to_html
					includes = {"include" => {"content" => article, "type" => "blog" }}
					output += (Liquid::Template.parse tmpl).render includes
				end
			end
			output
    end
  end
end
Liquid::Template.register_tag('blog_posts', Jekyll::BlogTag)
