# frozen_string_literal: true

require 'open-uri'
require 'json'
require 'date'

module Jekyll
  class CourseTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
    end

    def render(_context)
      if ENV['JEKYLL_ENV'] == 'production'
        tmpl = File.read(File.join(Dir.pwd, '_includes', 'box.html'))
        today = Date.today
        term = 'Fall'
        if (today.month >= 1) && (today.month < 6)
          term = 'Spring'
        elsif (today.month >= 6) && (today.month < 8)
          term = 'Summer'
        end
        term = "#{term} #{today.year}"
        output = ''
        JSON.parse(URI.parse("https://andrew.pilsch.com/courses/courses.php?json&blank&front_page&term=#{URI.escape(term)}").read).each do |course|
          course['image'] = course['course_image']
          course['title'] = "#{course['course_number']} #{course['course_title']}, #{course['course_term']}"
          course['id'] = course['course_id']
          course['short_description'] = Kramdown::Document.new(course['course_description'].is_a?(Array) ? course['course_description'].first : course['course_description']).to_html.to_s
          includes = { 'include' => { 'content' => course, 'type' => 'course' } }
          output += (Liquid::Template.parse tmpl).render includes
        end
      end
      output
    end
  end
end
Liquid::Template.register_tag('current_courses', Jekyll::CourseTag)
