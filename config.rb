###
# Compass
###

set :markdown_engine, :kramdown
set :markdown, :fenced_code_blocks => true,
               :autolink => true, 
               :smartypants => true,
               :footnotes => true,
               :superscript => true

@bower_config = JSON.parse(IO.read("#{root}/.bowerrc"))

# Change Compass configuration
compass_config do |config|
	config.add_import_path File.join "#{root}", @bower_config["directory"]
#   config.output_style = :compact
end

after_configuration do
    sprockets.append_path File.join "#{root}", @bower_config["directory"]
end

activate :syntax
#activate :similar

set :site_deploy_root, 'http://andrew.pilsch.com'

require "lib/courses.rb"
activate :course_manager
require "lib/research.rb"
activate :research_manager
require "lib/custom_haml_markdown.rb"

ready do
	ignore "/**/*.yml"
end

###
# Page options, layouts, aliases and proxies
###

page "*", :layout => "layout"

###
# Helpers
###

# List of jQuery plugins to load on every page.
#@jquery_plugins = ["isotope","hashchange"]

helpers do
	# Rot13 encodes a string
	def rot13(string)
	  string.tr "A-Za-z", "N-ZA-Mn-za-m"
	end
 
	# HTML encodes ASCII chars a-z, useful for obfuscating
	# an email address from spiders and spammers
	def html_obfuscate(string)
	  output_array = []
	  lower = %w(a b c d e f g h i j k l m n o p q r s t u v w x y z)
	  upper = %w(A B C D E F G H I J K L M N O P Q R S T U V W X Y Z)
	  char_array = string.split('')
	  char_array.each do |char|  
	    output = lower.index(char) + 97 if lower.include?(char)
	    output = upper.index(char) + 65 if upper.include?(char)
	    if output
	      output_array << "&##{output};"
	    else 
	      output_array << char
	    end
	  end
	  return output_array.join
	end
 
	# Takes in an email address and (optionally) anchor text,
	# its purpose is to obfuscate email addresses so spiders and
	# spammers can't harvest them.
	def js_antispam_email_link(email, linktext=email)
	  user, domain = email.split('@')
	  user   = html_obfuscate(user)
	  domain = html_obfuscate(domain)
	  # if linktext wasn't specified, throw encoded email address builder into js document.write statement
	  linktext = "'+'#{user}'+'@'+'#{domain}'+'" if linktext == email 
	  rot13_encoded_email = rot13(email) # obfuscate email address as rot13
	  out =  "<noscript>#{linktext}<br/><small>#{user}(at)#{domain}</small></noscript>\n" # js disabled browsers see this
	  out += "<script language='javascript'>\n"
	  out += "  <!--\n"
	  out += "    string = '#{rot13_encoded_email}'.replace(/[a-zA-Z]/g, function(c){ return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);});\n"
	  out += "    document.write('<a href='+'ma'+'il'+'to:'+ string +'>#{linktext}</a>'); \n"
	  out += "  //-->\n"
	  out += "</script>\n"
	  return out
	end
	
	def javascript_path(file_path)
		asset_path(:js, file_path)
	end
	
	# Build navigation links in which the active page is highlighted:
	def navigation_link_to(txt, url)
		page_index = request["path"].gsub("index.html","")
		
		if url == "/#{page_index}"
			return link_to(txt, url, :class => "active")
		end
		link_to(txt,url)
	end
    
    def image_link(source, options={})
        link_to(image_tag(source, options), image_path(source))
    end
    
    def blog_link(txt, key)
        link_to txt, blog_url(key)
    end
    
    def blog_url(key)
        object = blog.articles.find{ |article| article.title.downcase.include? key.downcase or article.url.include? key}
        if object.respond_to? :url
            object.url
        else
            ""
        end
    end
	def inline_image(source, options={})
		require 'base64'
		file = Dir.pwd + "/source/" + source
		if true
			options["data-original"] = source
			options["data-image-width"], options["data-image-height"] = FastImage.size(file)
			options["class"] = "lazy"
			image_tag("data:image/.gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", options)
		else
			image_tag("data:image/#{File.extname(file)};base64,#{Base64.encode64(File.read(file))}")
		end
	end
end

class Middleman::Sitemap::Resource
	def first_paragraph
		nokogiri_doc = Nokogiri::HTML(self.body)
		
		return nokogiri_doc.css("p").first.to_s
	end
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

#activate :directory_indexes

set :haml, { :ugly => true, :format => :html5 }

activate :directory_indexes
page "/blank.html", :directory_index => false
page "/ie8.html", :directory_index => false
#page "/blog/feed.xml", :layout => false
#page "/blog/rss.xml", :layout => false

# Build-specific configuration
configure :build do
  ignore "/courses/*"
  ignore "blog_old/*"
  ignore "blog/*"
  ignore "stylesheets/blog-old/*"
  
  # Files included in application.css/.js
  ignore "stylesheets/global.css"
  ignore "stylesheets/layout.css"
  ignore "stylesheets/application.css"
  ignore "stylesheets/old/*"
  ignore "stylesheets/fonts/genericons/genericons.css"
  ignore "javascripts/vendor/jquery/jquery.min.js"
  ignore "javascripts/vendor/jquery/plugins/jquery.isotope.min.js"
  ignore "javascripts/vendor/imagesloaded/*"
  ignore "javascripts/vendor/modernizr/*"
  ignore "javascripts/application.js"
  ignore "javascripts/plugins.js"
  ignore "javascripts/libraries/*"
  
  #ignore "/research/*"
  ignore "/**/*.rb"
  #set :http_prefix, "/new2"
  # Change this to build with a different file root.	
  #set :http_prefix, "/my/prefix/folder"

  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript, :inline => true
  activate :inliner
  activate :minify_html do |html|
	  html.remove_comments = false
  end

  #activate :gzip

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  #activate :relative_assets

  # Compress PNGs after build
  # I wouldn't use this.
  #activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end

after_build do
	printf "\033[1m\033[32m%12s\033[0m  %s\n", "compiling", "build/cv/cv.pdf"
	# Sometimes, you have a software error that you just have to kill with fire:
	# (there's a problem where Pandoc (or LaTeX) is eating the first character of every table. I'm too busy to figure out why, so I just added an extra character to the beginning of each table)
	system "cat source/cv/_src.md | ruby -e 'puts STDIN.read.gsub(/-\\|\\n\\| /,\"-|\\n| X\")' | pandoc -o build/cv/cv.pdf -f markdown+pipe_tables --template=lib/pandoc-templates/cv-template.tex --latex-engine=xelatex"
	#system "pandoc  -s source/cv/_src.md -o build/cv/cv.pdf -f markdown+pipe_tables --template=lib/pandoc-templates/cv-template.tex --latex-engine=xelatex"
end

activate :deploy do |deploy|
  deploy.method = :rsync
  deploy.user = "eschaton"
  deploy.host = "birkenfeld.dreamhost.com"
  deploy.path = "~/www/andrew.pilsch.com/"
end