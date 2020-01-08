# frozen_string_literal: true

require 'fastimage'
module Jekyll
  class InlineImageTag < Liquid::Tag
    def initialize(tag_name, src, tokens)
      super
      @source = src
    end

    def render(context)
      file_source = @source
      file_source = context[@source] if context.key? @source
      output = ''
      file = File.join(Dir.pwd, file_source)
      className = 'lazy db center mv3 bg-mid-gray'
      if File.file? file
        width, height = FastImage.size(file)
        style = "width: #{width}px; height: #{height}px;"
        output = "<img src=\"data:image/.gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" style=\"#{style}\" class=\"#{className}\" data-src=\"#{file_source}\" />"
      else
        style = 'height: 240px;'
        output = "<img src=\"data:image/.gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" style=\"#{style}\" class=\"#{className}\" data-src=\"#{file_source}\" />"
      end
      output
    end
  end
end
Liquid::Template.register_tag('inline_image', Jekyll::InlineImageTag)
