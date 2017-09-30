###
# Compass
###

set :markdown_engine, :kramdown
set :markdown, :fenced_code_blocks => true,
               :autolink => true, 
               :smartypants => true,
               :footnotes => true,
               :superscript => true
set :site_deploy_root, 'http://andrew.pilsch.com'

if defined? RailsAssets
	RailsAssets.load_paths.each do |path|
		compass_config do |config|
			config.add_import_path path
		end
	end
end

require "lib/courses.rb"
activate :course_manager
require "lib/research.rb"
activate :research_manager
require "lib/markdown-filter.rb"
activate :markdown_filter

ready do
	ignore "/**/*.yml"
end
activate :external_pipeline,
  name: :webpack,
  command: build? ? 'env NODE_ENV=production ./node_modules/.bin/webpack --bail' : 'env NODE_ENV=development ./node_modules/webpack/bin/webpack.js --watch -d',
  source: ".tmp/",
  latency: 1

###
# Helpers
###
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
	
	# Inline Asset Helpers:
	def fname(str, ext)
		str.concat(ext) unless str.match(ext)
		str
	end
	def render_resource(fname)
		sitemap.resources.find { |res| res.source_file.match("/" + fname) }.render
	end
	def inline_js(*args)
		args.map do |arg|
			"<script type='text/javascript' defer>#{render_resource(fname(arg, '.js'))}</script>"
		end.join("\n")
	end
	def inline_css(*args)
		args.map do |arg|
			"<style type='text/css'>#{render_resource(fname(arg, '.css'))}</style>"
		end.join("\n")
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

activate :autoprefixer

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

set :haml, { :format => :html5 }
Haml::TempleEngine.disable_option_validator!

activate :directory_indexes
page "/blank.html", :directory_index => false
page "/ie8.html", :directory_index => false
page "/style.php", :directory_index => false
page "/modules/Mobile_Detect.php", :directory_index => false

# Build-specific configuration
configure :build do
	ignore "/courses/*"
	# Pack those assets
	activate :minify_css, :inline => true
	activate :minify_javascript, :inline => true
	activate :minify_html do |html|
		html.remove_comments = false
	end
end

after_build do
	printf "\033[1m\033[32m%12s\033[0m  %s\n", "compiling", "build/cv/cv.pdf"
	# Sometimes, you have a software error that you just have to kill with fire:
	# (there's a problem where Pandoc (or LaTeX) is eating the first character of every table. I'm too busy to figure out why, so I just added an extra character to the beginning of each table)
	system "cat source/cv/_src.md | ruby -e 'puts STDIN.read.gsub(/-\\|\\n\\| /,\"-|\\n| X\")' | pandoc -o build/cv/cv.pdf -f markdown+pipe_tables --template=lib/pandoc-templates/cv-template.tex --latex-engine=xelatex"
	#system "pandoc  -s source/cv/_src.md -o build/cv/cv.pdf -f markdown+pipe_tables --template=lib/pandoc-templates/cv-template.tex --latex-engine=xelatex"
end

activate :deploy do |deploy|
  deploy.deploy_method = :rsync
  deploy.host = "eschaton@birkenfeld.dreamhost.com"
  deploy.path = "~/www/andrew.pilsch.com/"
end