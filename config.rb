###
# Compass
###

set :markdown_engine, :rdiscount
set :markdown, :fenced_code_blocks => true,
               :autolink => true, 
               :smartypants => true

# Change Compass configuration
compass_config do |config|
#   config.output_style = :compact
end

require "lib/courses.rb"
activate :course_manager
require "lib/research.rb"
activate :research_manager

require "bourbon"

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
	def javascript_path(file_path)
		asset_path(:js, file_path)
	end
	
	# This helper lets us load a list of jQuery plugins quickly and easily.
	# You can pass a list of jquery plugins in as an argument, change @jquery_plugins
	# below, or include an array named "jquery_plugins" in the page's YAML front
	# matter.
	
	# This function assumes a very specific file structure for your jQuery plugins. You
	# should store all your jQuery stuff in vendor/jquery folder inside your main 
	# javascripts folder. Then, plugins should be placed in a plugins folder inside the
	# vendor/jquery folder (so, vendor/jquery/plugins).
	# 
	# Plugin files must also be named in a very specific way. The master file naming
	# scheme is as follows:
	#
	#   jquery.plugin_name[-version.number][.min].js
	#
	# The elements in square brackets are optional. The file looks first for a minified
	# version of particular plugin, then includes a non-minified version. In the above 
	# example, all that would need to be passed to load_jquery_plugins (in one of the 3
	# ways discussed above) would be "plugin_name".
	#
	# For example, if you wanted to include jQuery Masonry in your code (and you had the
	# plugin stored in javascripts/vendor/jquery/plugins), the file would need to be
	# named:
	#
	#  jquery.masonry-2.1.05.min.js
	#
	# And could be included by mentioning "masonry" in the arguments to load_jquery_plugins
	# (when it is called), in @jquery_plugins (to load it on every page), or in the YAML
	# front matter of a specific page (to only load masonry when you need it).
	
	def load_jquery_plugins(*jquery_plugins)
		plugin_paths = gather_jquery_plugin_paths(jquery_plugins)
		include_tag = Proc.new{|n| javascript_include_tag(n)}
		plugin_paths.map(&include_tag).join("")
	end
	def gather_jquery_plugin_paths(*jquery_plugins)
		output = []
		# See if the YAML data for a page has a list of custom jquery:
		if current_page
			if current_page.data
				if current_page.data.jquery_plugins
					jquery_plugins += current_page.data.jquery_plugins
				end
			end
		end
		if @jquery_plugins.class == Array
			jquery_plugins = jquery_plugins +  @jquery_plugins
		end
		
		jquery_plugins = jquery_plugins.uniq
		
		jquery_plugins.each do |plugin|
			file_name = nil
			# Look for versioned jQuery plugins, if it exists:
			versioned_jquery_plugins = Dir.glob("#{Dir.pwd}/source/#{js_dir}/vendor/jquery/plugins/*#{plugin}-[0-9]*").sort{|x,y| y <=> x }
			# If we find versioned jQuery plugins, grab the most recent version (whether minified or not):
			if versioned_jquery_plugins.length > 0
				file_name = versioned_jquery_plugins[0].gsub("#{Dir.pwd}/source/#{js_dir}/","")
			end
			
			# If no versioned jQuery plugins, find unversioned:
			if file_name.nil?
				if File.exists? "#{Dir.pwd}/source/#{js_dir}/vendor/jquery/plugins/jquery.#{plugin}.min.js"
					file_name = "vendor/jquery/plugins/jquery.#{plugin}.min.js"
				elsif File.exists? "#{Dir.pwd}/source/#{js_dir}/vendor/jquery/plugins/jquery.#{plugin}.js"
					file_name = "vendor/jquery/plugins/jquery.#{plugin}.js"
				end
			end
			
			# Append javascript code to the output:
			if !file_name.nil?
				output << file_name
			end
		end
		
		output
	end
	
	# Load a custom javascript file for individual files in your site.
	# The naming convention converts slashes into underscores, so a file
	# named:
	#
	#  blog/index.html
	#
	# Would have a javascript file named blog_index.js.
	#
	# These files needed to be placed in a folder called pages within your
	# javascript directory.
	def per_page_javascript()
		page_index = request["path"].gsub(".html","").gsub("/","_")
		if File.exists? "#{Dir.pwd}/source/#{js_dir}/pages/#{page_index}.js"
			javascript_include_tag("pages/#{page_index}.js")
		end
	end
	
	# Build navigation links in which the active page is highlighted:
	def navigation_link_to(txt, url)
		page_index = request["path"].gsub("index.html","")
		
		if url == "/#{page_index}"
			return link_to(txt, url, :class => "active")
		end
		link_to(txt,url)
	end
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

#activate :blog do |blog|
#	blog.prefix = "blog"
#	blog.layout = "blog/layout"
#	blog.summary_separator = /(READMORE)/
#	blog.summary_length = 250
#end

# Build-specific configuration
configure :build do

  ignore "/courses/*"
  #ignore "/research/*"
  ignore "/**/*.rb"
  #set :http_prefix, "/new2"
  # Change this to build with a different file root.	
  #set :http_prefix, "/my/prefix/folder"

  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

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

activate :deploy do |deploy|
  deploy.method = :rsync
  deploy.user = "eschaton"
  deploy.host = "dynamo.dreamhost.com"
  deploy.path = "~/www/andrew.pilsch.com/"
end