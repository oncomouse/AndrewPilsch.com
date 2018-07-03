source 'https://rubygems.org'
git_source(:github) { |name| "https://github.com/#{name}.git" }

gem "activesupport"

gem "compass", "~> 1.0"
gem "sass", "~> 3.0"
gem "kramdown"
gem "builder"

gem "middleman", "~> 4"
gem "middleman-compass"
gem "middleman-autoprefixer"
gem "middleman-minify-html"
gem "middleman-livereload"
gem 'middleman-deploy', github: 'middleman-contrib/middleman-deploy', branch: 'master'

gem "fastimage"

gem 'wdm', '>= 0.1.0' if RbConfig::CONFIG['target_os'] =~ /mswin|mingw/i

source "https://rails-assets.org" do
    gem "rails-assets-normalize.scss"
    gem "rails-assets-susy", ">=2.2.5"
    gem "rails-assets-bourbon", ">=4.2.3"
	gem "rails-assets-support-for"
end
